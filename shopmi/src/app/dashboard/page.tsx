'use client';

import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Package, 
  MapPin, 
  Settings, 
  LogOut,
  ShoppingBag,
  Heart,
  CreditCard,
  Bell
} from 'lucide-react';

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#AE6FFB] mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== 'CLIENT') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acesso Negado</h1>
          <p className="text-gray-600 mb-6">Você precisa estar logado como cliente para acessar esta página.</p>
          <Link href="/auth/signin">
            <Button className="bg-[#AE6FFB] hover:bg-[#E05A00]">
              Fazer Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header do Dashboard */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <img
                  src="/logo-pico.svg"
                  alt="PICO"
                  className="h-8 w-auto mr-4"
                />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Minha Conta</h1>
                <p className="text-sm text-gray-600">Bem-vindo, {session.user.name}!</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Continuar Comprando
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card de Perfil */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-[#AE6FFB]" />
                <span>Meu Perfil</span>
              </CardTitle>
              <CardDescription>
                Gerencie suas informações pessoais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Nome:</strong> {session.user.name}</p>
                <p><strong>Email:</strong> {session.user.email}</p>
                <p className="text-gray-500">Clique para editar suas informações</p>
              </div>
              <Link href="/dashboard/profile" className="block mt-4">
                <Button className="w-full bg-[#AE6FFB] hover:bg-[#E05A00]" size="sm">
                  Editar Perfil
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Card de Pedidos */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-[#AE6FFB]" />
                <span>Meus Pedidos</span>
              </CardTitle>
              <CardDescription>
                Acompanhe seus pedidos e histórico
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500 mb-4">
                  Você ainda não fez nenhum pedido
                </p>
              </div>
              <Link href="/dashboard/orders" className="block">
                <Button className="w-full" variant="outline" size="sm">
                  Ver Pedidos
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Card de Endereços */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-[#AE6FFB]" />
                <span>Meus Endereços</span>
              </CardTitle>
              <CardDescription>
                Gerencie seus endereços de entrega
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500 mb-4">
                  Nenhum endereço cadastrado
                </p>
              </div>
              <Link href="/dashboard/addresses" className="block">
                <Button className="w-full" variant="outline" size="sm">
                  Gerenciar Endereços
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Card de Lista de Desejos */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-[#AE6FFB]" />
                <span>Lista de Desejos</span>
              </CardTitle>
              <CardDescription>
                Produtos que você salvou para depois
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <Heart className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500 mb-4">
                  Sua lista está vazia
                </p>
              </div>
              <Link href="/dashboard/wishlist" className="block">
                <Button className="w-full" variant="outline" size="sm">
                  Ver Lista
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Card de Métodos de Pagamento */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-[#AE6FFB]" />
                <span>Pagamento</span>
              </CardTitle>
              <CardDescription>
                Gerencie seus métodos de pagamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500 mb-4">
                  Nenhum cartão salvo
                </p>
              </div>
              <Link href="/dashboard/payment" className="block">
                <Button className="w-full" variant="outline" size="sm">
                  Gerenciar Cartões
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Card de Configurações */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-[#AE6FFB]" />
                <span>Configurações</span>
              </CardTitle>
              <CardDescription>
                Preferências e notificações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Notificações por email</span>
                  <div className="w-8 h-4 bg-gray-200 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">SMS de pedidos</span>
                  <div className="w-8 h-4 bg-gray-200 rounded-full"></div>
                </div>
              </div>
              <Link href="/dashboard/settings" className="block mt-4">
                <Button className="w-full" variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Configurar
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Seção de Ações Rápidas */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Ações Rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/shop">
              <Button className="w-full h-16 bg-[#AE6FFB] hover:bg-[#E05A00]">
                <ShoppingBag className="h-6 w-6 mr-2" />
                Comprar Agora
              </Button>
            </Link>
            <Link href="/dashboard/orders">
              <Button variant="outline" className="w-full h-16">
                <Package className="h-6 w-6 mr-2" />
                Rastrear Pedido
              </Button>
            </Link>
            <Link href="/dashboard/addresses">
              <Button variant="outline" className="w-full h-16">
                <MapPin className="h-6 w-6 mr-2" />
                Novo Endereço
              </Button>
            </Link>
            <Link href="/support">
              <Button variant="outline" className="w-full h-16">
                <Bell className="h-6 w-6 mr-2" />
                Suporte
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 