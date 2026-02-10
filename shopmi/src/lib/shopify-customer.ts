/**
 * Shopify Customer Admin API Functions
 *
 * Funções para criar e gerenciar clientes via Shopify Admin API
 * Utilizado para criar clientes de forma síncrona durante o registro
 */

import { ApolloClient, InMemoryCache, createHttpLink, gql } from '@apollo/client';

// Configuração da Admin API
const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_ADMIN_API_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;

if (!SHOPIFY_ADMIN_API_TOKEN) {
  // SHOPIFY_ADMIN_API_TOKEN is not defined
}

// Criando o link HTTP para a Admin API GraphQL
const adminLink = createHttpLink({
  uri: `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2025-01/graphql.json`,
  headers: {
    'X-Shopify-Access-Token': SHOPIFY_ADMIN_API_TOKEN || '',
    'Content-Type': 'application/json',
  },
});

// Cliente Apollo para a Admin API
export const adminClient = new ApolloClient({
  link: adminLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },
});

// Interfaces
export interface ShopifyCustomerInput {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  tags?: string[];
}

export interface ShopifyCustomerResponse {
  shopifyCustomerId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface ShopifyCustomerData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  ordersCount: number;
  totalSpent: string;
  tags: string[];
  addresses: {
    address1: string;
    address2: string | null;
    city: string;
    province: string;
    provinceCode: string;
    country: string;
    countryCode: string;
    zip: string;
    phone: string | null;
  }[];
}

/**
 * Cria um cliente na Shopify via Admin API
 * @param input Dados do cliente a ser criado
 * @returns Dados do cliente criado incluindo o shopifyCustomerId
 */
export async function createShopifyCustomer(
  input: ShopifyCustomerInput
): Promise<ShopifyCustomerResponse> {
  const CUSTOMER_CREATE = gql`
    mutation customerCreate($input: CustomerInput!) {
      customerCreate(input: $input) {
        customer {
          id
          email
          firstName
          lastName
          phone
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const response = await adminClient.mutate({
      mutation: CUSTOMER_CREATE,
      variables: {
        input: {
          email: input.email,
          firstName: input.firstName,
          lastName: input.lastName,
          phone: input.phone || null,
          tags: input.tags || [],
        }
      }
    });

    // Verificar erros da Shopify
    if (response.data?.customerCreate?.userErrors?.length > 0) {
      const errors = response.data.customerCreate.userErrors;
      throw new Error(`Shopify Error: ${errors[0].message}`);
    }

    const customer = response.data?.customerCreate?.customer;

    if (!customer) {
      throw new Error('Nenhum dado de cliente retornado pela Shopify');
    }

    // Extrair o ID numérico do cliente do GID da Shopify
    // Formato: "gid://shopify/Customer/1234567890"
    const shopifyCustomerId = customer.id.split('/').pop();

    return {
      shopifyCustomerId: shopifyCustomerId!,
      email: customer.email,
      firstName: customer.firstName,
      lastName: customer.lastName,
      phone: customer.phone,
    };

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Falha ao criar cliente na Shopify: ${error.message}`);
    }

    throw new Error('Falha ao criar cliente na Shopify: erro desconhecido');
  }
}

/**
 * Busca dados completos de um cliente na Shopify via Admin API
 * @param shopifyCustomerId ID do cliente na Shopify (apenas o número, não o GID)
 * @returns Dados completos do cliente
 */
export async function getShopifyCustomer(
  shopifyCustomerId: string
): Promise<ShopifyCustomerData | null> {
  const CUSTOMER_QUERY = gql`
    query getCustomer($id: ID!) {
      customer(id: $id) {
        id
        email
        firstName
        lastName
        phone
        ordersCount
        totalSpent
        tags
        addresses {
          address1
          address2
          city
          province
          provinceCode
          country
          countryCode
          zip
          phone
        }
      }
    }
  `;

  try {
    // Construir o GID completo se apenas o ID foi passado
    const gid = shopifyCustomerId.startsWith('gid://')
      ? shopifyCustomerId
      : `gid://shopify/Customer/${shopifyCustomerId}`;

    const response = await adminClient.query({
      query: CUSTOMER_QUERY,
      variables: { id: gid }
    });

    const customer = response.data?.customer;

    if (!customer) {
      return null;
    }

    return customer;

  } catch (error) {
    return null;
  }
}

/**
 * Atualiza dados de um cliente na Shopify via Admin API
 * @param shopifyCustomerId ID do cliente na Shopify
 * @param input Dados a serem atualizados
 */
export async function updateShopifyCustomer(
  shopifyCustomerId: string,
  input: Partial<ShopifyCustomerInput>
): Promise<boolean> {
  const CUSTOMER_UPDATE = gql`
    mutation customerUpdate($input: CustomerInput!) {
      customerUpdate(input: $input) {
        customer {
          id
          email
          firstName
          lastName
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  try {
    // Construir o GID completo
    const gid = shopifyCustomerId.startsWith('gid://')
      ? shopifyCustomerId
      : `gid://shopify/Customer/${shopifyCustomerId}`;

    const response = await adminClient.mutate({
      mutation: CUSTOMER_UPDATE,
      variables: {
        input: {
          id: gid,
          ...input
        }
      }
    });

    if (response.data?.customerUpdate?.userErrors?.length > 0) {
      return false;
    }

    return true;

  } catch (error) {
    return false;
  }
}
