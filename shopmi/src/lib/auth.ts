import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "./db"
import { getBaseUrl, logEnvironmentInfo } from "./utils"

// Log da configuração do ambiente para debug
logEnvironmentInfo()

// Função para gerar secret temporário se não existir
function getNextAuthSecret() {
  if (process.env.NEXTAUTH_SECRET) {
    return process.env.NEXTAUTH_SECRET
  }
  
  // Gerar um secret temporário para build
  const crypto = require('crypto')
  const tempSecret = crypto.randomBytes(32).toString('base64')
  return tempSecret
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      role: "CLIENT" | "ADMIN"
      shopifyCustomerId?: string | null
    }
  }

  interface User {
    id: string
    email: string
    name?: string | null
    role: "CLIENT" | "ADMIN"
    shopifyCustomerId?: string | null
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: getNextAuthSecret(),
  trustHost: true,
  basePath: "/api/auth",
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string
          }
        });

        if (!user) {
          return null;
        }

        // Validar role - aceitar tanto ADMIN quanto CLIENT
        if (user.role !== 'ADMIN' && user.role !== 'CLIENT') {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash || ""
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          shopifyCustomerId: user.shopifyCustomerId,
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
  useSecureCookies: process.env.NODE_ENV === 'production',
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.shopifyCustomerId = user.shopifyCustomerId
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as "CLIENT" | "ADMIN"
        session.user.shopifyCustomerId = token.shopifyCustomerId as string | null
      }
      return session
    },
    // Callback para redirecionamento personalizado
    async redirect({ url, baseUrl }) {
      const actualBaseUrl = getBaseUrl()

      // Se a URL for relativa, usar a baseUrl atual
      if (url.startsWith('/')) {
        return `${actualBaseUrl}${url}`
      }
      
      // Se a URL for da mesma origem, permitir
      if (url.startsWith(actualBaseUrl)) {
        return url
      }
      
      // Caso contrário, redirecionar para a página inicial
      return actualBaseUrl
    }
  },
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === 'development',
}) 