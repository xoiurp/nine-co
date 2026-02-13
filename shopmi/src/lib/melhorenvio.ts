import axios from 'axios';

// Tipos para as requisições
interface Address {
  postal_code: string;
  address?: string;
  number?: string;
  complement?: string;
  district?: string;
  city?: string;
  state_abbr?: string;
  country_id?: string;
}

interface PackageDimensions {
  weight: number; // em kg
  width: number;  // em cm
  height: number; // em cm
  length: number; // em cm
}

interface ShippingOptions {
  insurance_value?: number;
  receipt?: boolean;
  own_hand?: boolean;
  collect?: boolean;
  non_commercial?: boolean;
}

interface ShippingCalculatePayload {
  from: Address;
  to: Address;
  package: PackageDimensions;
  services?: string; // IDs dos serviços separados por vírgula (ex: "1,2")
  options?: ShippingOptions;
}

interface ShippingResponse {
  id: number;
  name: string;
  price: string;
  custom_price?: string;
  discount?: string;
  currency: string;
  delivery_time?: number;
  delivery_range?: {
    min: number;
    max: number;
  };
  custom_delivery_time?: number;
  custom_delivery_range?: {
    min: number;
    max: number;
  };
  packages?: unknown[]; // Alterado para unknown[]
  additional_services?: unknown; // Alterado para unknown
  company?: {
    id: number;
    name: string;
    picture: string;
  };
  error?: string;
}

// Configuração da API
// Usa MELHOR_ENVIO_SANDBOX=true para forçar sandbox, caso contrário usa produção
const API_URL = process.env.MELHOR_ENVIO_SANDBOX === 'true'
  ? 'https://sandbox.melhorenvio.com.br/api/v2'
  : 'https://melhorenvio.com.br/api/v2';
const TOKEN = process.env.MELHOR_ENVIO_TOKEN;
const CLIENT_ID = process.env.MELHOR_ENVIO_CLIENT_ID;
// const CLIENT_SECRET = process.env.MELHOR_ENVIO_CLIENT_SECRET; // Removido - não utilizado

// Função para formatar o token de acesso (adicionar prefixo "Bearer " se necessário)
function formatToken(token: string | undefined): string {
  if (!token) return '';
  
  // Se o token já começa com "Bearer ", retorna como está
  if (token.startsWith('Bearer ')) {
    return token;
  }
  
  // Caso contrário, adiciona o prefixo "Bearer "
  return `Bearer ${token}`;
}

// Criar instância do axios com configurações padrão
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Authorization': formatToken(TOKEN),
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': 'NineCO (contato@nineco.com.br)'
  },
  timeout: 5000 // 5 segundos
});

// Interceptador para requisições
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptador para respostas
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interface para o payload de cálculo com produtos
interface ShippingCalculateWithProductsPayload {
  from: Address;
  to: Address;
  products?: Array<{
    id: string;
    width: number;
    height: number;
    length: number;
    weight: number;
    insurance_value: number;
    quantity: number;
  }>;
  volumes?: Array<{
    width: number;
    height: number;
    length: number;
    weight: number;
  }>;
  services?: string;
  options?: ShippingOptions;
}

// Função para calcular frete
async function calculateShipment(payload: ShippingCalculatePayload | ShippingCalculateWithProductsPayload): Promise<ShippingResponse[]> {
  try {
    // Converter payload antigo para o novo formato se necessário
    let finalPayload: any = payload;
    
    if ('package' in payload) {
      // Formato antigo com 'package' - converter para 'volumes'
      finalPayload = {
        from: payload.from,
        to: payload.to,
        volumes: [{
          width: payload.package.width,
          height: payload.package.height,
          length: payload.package.length,
          weight: payload.package.weight
        }],
        services: payload.services,
        options: payload.options
      };
    }
    
    const response = await apiClient.post('/me/shipment/calculate', finalPayload);

    // Verificar se a resposta é válida
    if (!response.data) {
      throw new Error('Resposta vazia da API do Melhor Envio');
    }
    
    // Se a resposta for um objeto de erro em vez de array
    if (!Array.isArray(response.data)) {
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      
      // Tentar extrair mensagem de erro de outros formatos possíveis
      if (response.data.message) {
        throw new Error(response.data.message);
      }
      
      // Se não for array mas também não tiver erro claro, retornar o objeto como está
      // para análise posterior
      return response.data;
    }
    
    return response.data;
  } catch (error: any) {
    throw error;
  }
}

// Função para obter serviços de envio disponíveis
// TODO: Definir uma interface para a resposta de getShipmentServices
async function getShipmentServices(): Promise<unknown> {
  try {
    const response = await apiClient.get('/me/shipment/services');
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Novos endpoints para etiquetas de envio

// Interface para adicionar pedido ao carrinho
interface CartItem {
  service: number;
  agency?: number;
  from: {
    name: string;
    phone: string;
    email: string;
    document: string;
    company_document?: string;
    state_register?: string;
    address: string;
    complement?: string;
    number: string;
    district: string;
    city: string;
    country_id: string;
    postal_code: string;
    note?: string;
  };
  to: {
    name: string;
    phone: string;
    email: string;
    document: string;
    company_document?: string;
    state_register?: string;
    address: string;
    complement?: string;
    number: string;
    district: string;
    city: string;
    country_id: string;
    postal_code: string;
    note?: string;
  };
  products: Array<{
    name: string;
    quantity: number;
    unitary_value: number;
  }>;
  volumes: Array<{
    height: number;
    width: number;
    length: number;
    weight: number;
  }>;
  options: {
    insurance_value?: number;
    receipt?: boolean;
    own_hand?: boolean;
    reverse?: boolean;
    non_commercial?: boolean;
    invoice?: {
      key: string;
    };
  };
}

// Função para adicionar pedido ao carrinho
async function addToCart(item: CartItem): Promise<unknown> {
  try {
    const response = await apiClient.post('/me/cart', item);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Função para obter itens do carrinho
async function getCart(): Promise<unknown> {
  try {
    const response = await apiClient.get('/me/cart');
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Função para remover item do carrinho
async function removeFromCart(orderIds: string[]): Promise<unknown> {
  try {
    const response = await apiClient.delete('/me/cart', {
      data: { orders: orderIds }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Função para fazer checkout (comprar frete)
async function checkout(): Promise<unknown> {
  try {
    const response = await apiClient.post('/me/shipment/checkout');
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Função para gerar etiquetas
async function generateLabels(orders: Array<{ id: string }>): Promise<unknown> {
  try {
    const response = await apiClient.post('/me/shipment/generate', { orders });
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Função para imprimir etiquetas
async function printLabels(orders: Array<{ id: string }>): Promise<unknown> {
  try {
    const response = await apiClient.post('/me/shipment/print', { orders });
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Função para obter etiqueta específica
async function getLabel(orderId: string): Promise<unknown> {
  try {
    const response = await apiClient.get(`/me/shipment/${orderId}/print`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Função para rastrear pedidos
async function trackOrders(orders: Array<{ id: string }>): Promise<unknown> {
  try {
    const response = await apiClient.post('/me/shipment/tracking', { orders });
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Função para obter informações da empresa
async function getCompanyInfo(): Promise<unknown> {
  try {
    const response = await apiClient.get('/me/company');
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Função para obter saldo da conta
async function getBalance(): Promise<unknown> {
  try {
    const response = await apiClient.get('/me/balance');
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Exportar funções e tipos
export {
  calculateShipment,
  getShipmentServices,
  addToCart,
  getCart,
  removeFromCart,
  checkout,
  generateLabels,
  printLabels,
  getLabel,
  trackOrders,
  getCompanyInfo,
  getBalance,
  type CartItem,
  type ShippingCalculatePayload,
  type ShippingResponse,
  type Address,
  type PackageDimensions,
  type ShippingOptions
};

// Para manter compatibilidade com código existente, exportamos um objeto com as mesmas propriedades
const melhorEnvioService = {
  shipment: {
    calculate: calculateShipment,
    getServices: getShipmentServices,
    addToCart,
    getCart,
    removeFromCart,
    checkout,
    generateLabels,
    printLabels,
    getLabel,
    trackOrders
  },
  company: {
    getInfo: getCompanyInfo,
    getBalance
  }
};

export default melhorEnvioService;
