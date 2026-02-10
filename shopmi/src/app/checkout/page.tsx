'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeft,
  CreditCard,
  QrCode,
  FileText,
  Truck,
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';

// Tipos
interface CustomerData {
  name: string;
  email: string;
  cpf: string;
  phone: string;
}

interface AddressData {
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

interface CardData {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
  installments: number;
}

type PaymentMethod = 'credit_card' | 'pix' | 'boleto';
type CheckoutStep = 'customer' | 'address' | 'payment' | 'review';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, totalPrice, totalItems, selectedShipping, clearCart } = useCart();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('customer');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [customer, setCustomer] = useState<CustomerData>({
    name: '', email: '', cpf: '', phone: ''
  });

  const [address, setAddress] = useState<AddressData>({
    cep: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: ''
  });

  const [card, setCard] = useState<CardData>({
    number: '', name: '', expiry: '', cvv: '', installments: 1
  });

  useEffect(() => {
    if (cart.length === 0 && !orderComplete) {
      router.push('/');
    }
  }, [cart, router, orderComplete]);

  const fetchAddressByCep = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return;
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setAddress(prev => ({
          ...prev,
          street: data.logradouro || '',
          neighborhood: data.bairro || '',
          city: data.localidade || '',
          state: data.uf || ''
        }));
      }
    } catch (err) {
      // CEP lookup failed silently
    }
  };

  const formatCPF = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatPhone = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2').replace(/(-\d{4})\d+?$/, '$1');
  };

  const formatCEP = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').replace(/(-\d{3})\d+?$/, '$1');
  };

  const formatCardNumber = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{4})(\d)/, '$1 $2').replace(/(\d{4})(\d)/, '$1 $2').replace(/(\d{4})(\d)/, '$1 $2').replace(/(\d{4})\d+?$/, '$1');
  };

  const formatExpiry = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').replace(/(\/\d{2})\d+?$/, '$1');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const shippingPrice = selectedShipping ? parseFloat(selectedShipping.price) : 0;
  const subtotal = totalPrice;
  const pixDiscount = paymentMethod === 'pix' ? subtotal * 0.05 : 0;
  const total = subtotal + shippingPrice - pixDiscount;

  const getInstallmentOptions = () => {
    const options = [];
    for (let i = 1; i <= 12; i++) {
      const value = total / i;
      if (value >= 50 || i === 1) {
        const hasInterest = i > 6;
        const totalWithInterest = hasInterest ? total * Math.pow(1.0199, i) : total;
        options.push({ installments: i, value: totalWithInterest / i, total: totalWithInterest, hasInterest });
      }
    }
    return options;
  };

  const validateCustomer = () => {
    if (!customer.name || customer.name.split(' ').length < 2) { setError('Digite seu nome completo'); return false; }
    if (!customer.email || !customer.email.includes('@')) { setError('Digite um email válido'); return false; }
    if (!customer.cpf || customer.cpf.replace(/\D/g, '').length !== 11) { setError('Digite um CPF válido'); return false; }
    if (!customer.phone || customer.phone.replace(/\D/g, '').length < 10) { setError('Digite um telefone válido'); return false; }
    setError(null); return true;
  };

  const validateAddress = () => {
    if (!address.cep || address.cep.replace(/\D/g, '').length !== 8) { setError('Digite um CEP válido'); return false; }
    if (!address.street) { setError('Digite o endereço'); return false; }
    if (!address.number) { setError('Digite o número'); return false; }
    if (!address.neighborhood) { setError('Digite o bairro'); return false; }
    if (!address.city) { setError('Digite a cidade'); return false; }
    if (!address.state) { setError('Digite o estado'); return false; }
    setError(null); return true;
  };

  const validatePayment = () => {
    if (paymentMethod === 'credit_card') {
      if (!card.number || card.number.replace(/\D/g, '').length < 16) { setError('Digite um número de cartão válido'); return false; }
      if (!card.name) { setError('Digite o nome no cartão'); return false; }
      if (!card.expiry || card.expiry.replace(/\D/g, '').length !== 4) { setError('Digite a validade do cartão'); return false; }
      if (!card.cvv || card.cvv.length < 3) { setError('Digite o CVV'); return false; }
    }
    setError(null); return true;
  };

  const nextStep = () => {
    if (currentStep === 'customer' && validateCustomer()) setCurrentStep('address');
    else if (currentStep === 'address' && validateAddress()) setCurrentStep('payment');
    else if (currentStep === 'payment' && validatePayment()) setCurrentStep('review');
  };

  const prevStep = () => {
    if (currentStep === 'address') setCurrentStep('customer');
    else if (currentStep === 'payment') setCurrentStep('address');
    else if (currentStep === 'review') setCurrentStep('payment');
  };

  const processPayment = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setOrderComplete(true);
      clearCart();
    } catch (err) {
      setError('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4">
        <div className="bg-white shadow-sm p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-[#f5f5f5] flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-[#1a1a1a]" />
          </div>
          <h1 className="text-2xl font-light uppercase tracking-wide text-[#1a1a1a] mb-2">Pedido Confirmado!</h1>
          <p className="text-[#666] mb-6">Seu pedido foi realizado com sucesso. Você receberá um email com os detalhes.</p>
          <div className="bg-[#f5f5f5] p-4 mb-6">
            <p className="text-sm text-[#999]">Número do pedido</p>
            <p className="text-lg font-mono font-bold text-[#1a1a1a]">#NC{Date.now().toString().slice(-8)}</p>
          </div>
          <Link href="/" className="block w-full bg-[#1a1a1a] text-white py-3 text-xs uppercase tracking-[0.15em] font-medium hover:bg-black transition-colors text-center">
            Voltar para a Loja
          </Link>
        </div>
      </div>
    );
  }

  const steps = [
    { id: 'customer', label: 'Dados', number: 1 },
    { id: 'address', label: 'Entrega', number: 2 },
    { id: 'payment', label: 'Pagamento', number: 3 },
    { id: 'review', label: 'Revisão', number: 4 }
  ];
  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <header className="bg-white border-b border-[#e0e0e0] sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[#666] hover:text-[#1a1a1a]">
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline text-sm">Voltar</span>
          </Link>
          <Link href="/">
            <Image src="/assets/images/novo-logo.svg" alt="PICO" width={120} height={40} className="h-8 w-auto" />
          </Link>
          <div className="flex items-center gap-2 text-[#1a1a1a]">
            <Lock className="w-4 h-4" />
            <span className="text-xs uppercase tracking-[0.1em] font-medium hidden sm:inline">Compra Segura</span>
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="bg-white border-b border-[#e0e0e0]">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 flex items-center justify-center text-sm font-medium ${index <= currentStepIndex ? 'bg-[#1a1a1a] text-white' : 'bg-[#e0e0e0] text-[#999]'}`}>
                    {index < currentStepIndex ? <CheckCircle2 className="w-5 h-5" /> : step.number}
                  </div>
                  <span className={`text-xs mt-1 ${index <= currentStepIndex ? 'text-[#1a1a1a] font-medium' : 'text-[#999]'}`}>{step.label}</span>
                </div>
                {index < steps.length - 1 && <div className={`flex-1 h-[2px] mx-2 ${index < currentStepIndex ? 'bg-[#1a1a1a]' : 'bg-[#e0e0e0]'}`} />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Main */}
      <main className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-sm p-6">
              {error && (
                <div className="mb-6 p-4 bg-[#f5f5f5] border border-[#e0e0e0] flex items-center gap-3 text-[#1a1a1a]">
                  <AlertCircle className="w-5 h-5 text-[#1a1a1a]" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Step 1: Customer */}
              {currentStep === 'customer' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-light uppercase tracking-wide text-[#1a1a1a]">Seus Dados</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-[#666] mb-1">Nome Completo *</label>
                      <input type="text" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} className="w-full px-4 py-3 border border-[#e0e0e0] focus:ring-2 focus:ring-[#1a1a1a] focus:border-transparent outline-none text-[#1a1a1a]" placeholder="Digite seu nome completo" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-[#666] mb-1">Email *</label>
                      <input type="email" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} className="w-full px-4 py-3 border border-[#e0e0e0] focus:ring-2 focus:ring-[#1a1a1a] focus:border-transparent outline-none text-[#1a1a1a]" placeholder="seu@email.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#666] mb-1">CPF *</label>
                      <input type="text" value={customer.cpf} onChange={(e) => setCustomer({ ...customer, cpf: formatCPF(e.target.value) })} className="w-full px-4 py-3 border border-[#e0e0e0] focus:ring-2 focus:ring-[#1a1a1a] focus:border-transparent outline-none text-[#1a1a1a]" placeholder="000.000.000-00" maxLength={14} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#666] mb-1">Telefone *</label>
                      <input type="text" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: formatPhone(e.target.value) })} className="w-full px-4 py-3 border border-[#e0e0e0] focus:ring-2 focus:ring-[#1a1a1a] focus:border-transparent outline-none text-[#1a1a1a]" placeholder="(00) 00000-0000" maxLength={15} />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Address */}
              {currentStep === 'address' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-light uppercase tracking-wide text-[#1a1a1a]">Endereço de Entrega</h2>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#666] mb-1">CEP *</label>
                      <input type="text" value={address.cep} onChange={(e) => { const f = formatCEP(e.target.value); setAddress({ ...address, cep: f }); if (f.replace(/\D/g, '').length === 8) fetchAddressByCep(f); }} className="w-full px-4 py-3 border border-[#e0e0e0] focus:ring-2 focus:ring-[#1a1a1a] focus:border-transparent outline-none text-[#1a1a1a]" placeholder="00000-000" maxLength={9} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-[#666] mb-1">Endereço *</label>
                      <input type="text" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} className="w-full px-4 py-3 border border-[#e0e0e0] focus:ring-2 focus:ring-[#1a1a1a] focus:border-transparent outline-none text-[#1a1a1a]" placeholder="Rua, Avenida..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#666] mb-1">Número *</label>
                      <input type="text" value={address.number} onChange={(e) => setAddress({ ...address, number: e.target.value })} className="w-full px-4 py-3 border border-[#e0e0e0] focus:ring-2 focus:ring-[#1a1a1a] focus:border-transparent outline-none text-[#1a1a1a]" placeholder="123" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-[#666] mb-1">Complemento</label>
                      <input type="text" value={address.complement} onChange={(e) => setAddress({ ...address, complement: e.target.value })} className="w-full px-4 py-3 border border-[#e0e0e0] focus:ring-2 focus:ring-[#1a1a1a] focus:border-transparent outline-none text-[#1a1a1a]" placeholder="Apto, Bloco..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#666] mb-1">Bairro *</label>
                      <input type="text" value={address.neighborhood} onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })} className="w-full px-4 py-3 border border-[#e0e0e0] focus:ring-2 focus:ring-[#1a1a1a] focus:border-transparent outline-none text-[#1a1a1a]" placeholder="Bairro" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#666] mb-1">Cidade *</label>
                      <input type="text" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="w-full px-4 py-3 border border-[#e0e0e0] focus:ring-2 focus:ring-[#1a1a1a] focus:border-transparent outline-none text-[#1a1a1a]" placeholder="Cidade" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#666] mb-1">Estado *</label>
                      <select value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} className="w-full px-4 py-3 border border-[#e0e0e0] focus:ring-2 focus:ring-[#1a1a1a] focus:border-transparent outline-none text-[#1a1a1a]">
                        <option value="">Selecione</option>
                        {['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'].map(uf => <option key={uf} value={uf}>{uf}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 'payment' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-light uppercase tracking-wide text-[#1a1a1a]">Forma de Pagamento</h2>
                  <div className="grid sm:grid-cols-3 gap-3">
                    <button type="button" onClick={() => setPaymentMethod('credit_card')} className={`p-4 border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'credit_card' ? 'border-[#1a1a1a] bg-[#f5f5f5]' : 'border-[#e0e0e0] hover:border-[#999]'}`}>
                      <CreditCard className={`w-6 h-6 ${paymentMethod === 'credit_card' ? 'text-[#1a1a1a]' : 'text-[#999]'}`} />
                      <span className={`text-sm font-medium ${paymentMethod === 'credit_card' ? 'text-[#1a1a1a]' : 'text-[#666]'}`}>Cartão</span>
                    </button>
                    <button type="button" onClick={() => setPaymentMethod('pix')} className={`p-4 border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'pix' ? 'border-[#1a1a1a] bg-[#f5f5f5]' : 'border-[#e0e0e0] hover:border-[#999]'}`}>
                      <QrCode className={`w-6 h-6 ${paymentMethod === 'pix' ? 'text-[#1a1a1a]' : 'text-[#999]'}`} />
                      <span className={`text-sm font-medium ${paymentMethod === 'pix' ? 'text-[#1a1a1a]' : 'text-[#666]'}`}>PIX</span>
                      <span className="text-xs text-[#1a1a1a] font-medium">5% OFF</span>
                    </button>
                    <button type="button" onClick={() => setPaymentMethod('boleto')} className={`p-4 border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'boleto' ? 'border-[#1a1a1a] bg-[#f5f5f5]' : 'border-[#e0e0e0] hover:border-[#999]'}`}>
                      <FileText className={`w-6 h-6 ${paymentMethod === 'boleto' ? 'text-[#1a1a1a]' : 'text-[#999]'}`} />
                      <span className={`text-sm font-medium ${paymentMethod === 'boleto' ? 'text-[#1a1a1a]' : 'text-[#666]'}`}>Boleto</span>
                    </button>
                  </div>

                  {paymentMethod === 'credit_card' && (
                    <div className="space-y-4 pt-4 border-t border-[#e0e0e0]">
                      <div>
                        <label className="block text-sm font-medium text-[#666] mb-1">Número do Cartão *</label>
                        <input type="text" value={card.number} onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })} className="w-full px-4 py-3 border border-[#e0e0e0] focus:ring-2 focus:ring-[#1a1a1a] focus:border-transparent outline-none text-[#1a1a1a]" placeholder="0000 0000 0000 0000" maxLength={19} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#666] mb-1">Nome no Cartão *</label>
                        <input type="text" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value.toUpperCase() })} className="w-full px-4 py-3 border border-[#e0e0e0] focus:ring-2 focus:ring-[#1a1a1a] focus:border-transparent outline-none text-[#1a1a1a]" placeholder="NOME COMO NO CARTÃO" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#666] mb-1">Validade *</label>
                          <input type="text" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })} className="w-full px-4 py-3 border border-[#e0e0e0] focus:ring-2 focus:ring-[#1a1a1a] focus:border-transparent outline-none text-[#1a1a1a]" placeholder="MM/AA" maxLength={5} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#666] mb-1">CVV *</label>
                          <input type="text" value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '') })} className="w-full px-4 py-3 border border-[#e0e0e0] focus:ring-2 focus:ring-[#1a1a1a] focus:border-transparent outline-none text-[#1a1a1a]" placeholder="123" maxLength={4} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#666] mb-1">Parcelas</label>
                        <select value={card.installments} onChange={(e) => setCard({ ...card, installments: parseInt(e.target.value) })} className="w-full px-4 py-3 border border-[#e0e0e0] focus:ring-2 focus:ring-[#1a1a1a] focus:border-transparent outline-none text-[#1a1a1a]">
                          {getInstallmentOptions().map(opt => (
                            <option key={opt.installments} value={opt.installments}>
                              {opt.installments}x de {formatCurrency(opt.value)} {opt.hasInterest ? '(com juros)' : 'sem juros'}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'pix' && (
                    <div className="p-4 bg-[#f5f5f5] border border-[#e0e0e0]">
                      <p className="text-[#1a1a1a] font-medium">Você ganha 5% de desconto pagando com PIX!</p>
                      <p className="text-[#666] text-sm mt-1">O QR Code será gerado após confirmar o pedido.</p>
                    </div>
                  )}

                  {paymentMethod === 'boleto' && (
                    <div className="p-4 bg-[#f5f5f5] border border-[#e0e0e0]">
                      <p className="text-[#1a1a1a] font-medium">Boleto Bancário</p>
                      <p className="text-[#666] text-sm mt-1">O boleto será gerado após confirmar o pedido. Prazo de compensação: até 3 dias úteis.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Review */}
              {currentStep === 'review' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-light uppercase tracking-wide text-[#1a1a1a]">Revisão do Pedido</h2>

                  <div className="space-y-4">
                    <div className="p-4 bg-[#f5f5f5]">
                      <h3 className="font-medium text-[#1a1a1a] mb-2">Dados Pessoais</h3>
                      <p className="text-[#666] text-sm">{customer.name}</p>
                      <p className="text-[#666] text-sm">{customer.email}</p>
                      <p className="text-[#666] text-sm">{customer.phone}</p>
                    </div>

                    <div className="p-4 bg-[#f5f5f5]">
                      <h3 className="font-medium text-[#1a1a1a] mb-2">Endereço de Entrega</h3>
                      <p className="text-[#666] text-sm">{address.street}, {address.number} {address.complement}</p>
                      <p className="text-[#666] text-sm">{address.neighborhood} - {address.city}/{address.state}</p>
                      <p className="text-[#666] text-sm">CEP: {address.cep}</p>
                    </div>

                    <div className="p-4 bg-[#f5f5f5]">
                      <h3 className="font-medium text-[#1a1a1a] mb-2">Pagamento</h3>
                      <p className="text-[#666] text-sm">
                        {paymentMethod === 'credit_card' && `Cartão de Crédito - ${card.installments}x`}
                        {paymentMethod === 'pix' && 'PIX (5% de desconto)'}
                        {paymentMethod === 'boleto' && 'Boleto Bancário'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t border-[#e0e0e0]">
                {currentStep !== 'customer' ? (
                  <button onClick={prevStep} className="px-6 py-3 border border-[#e0e0e0] text-[#666] text-xs uppercase tracking-[0.15em] font-medium hover:bg-[#f5f5f5] transition-colors">
                    Voltar
                  </button>
                ) : <div />}

                {currentStep !== 'review' ? (
                  <button onClick={nextStep} className="px-8 py-3 bg-[#1a1a1a] text-white text-xs uppercase tracking-[0.15em] font-medium hover:bg-black transition-colors">
                    Continuar
                  </button>
                ) : (
                  <button onClick={processPayment} disabled={isProcessing} className="px-8 py-3 bg-[#1a1a1a] text-white text-xs uppercase tracking-[0.15em] font-medium hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-5 h-5" />
                        Finalizar Compra
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-light uppercase tracking-wide text-[#1a1a1a] mb-4">Resumo do Pedido</h3>

              {/* Items */}
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-[#f5f5f5] overflow-hidden flex-shrink-0">
                      {item.image && (
                        <Image src={item.image} alt={item.title} width={64} height={64} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1a1a1a] truncate">{item.title}</p>
                      <p className="text-sm text-[#999]">Qtd: {item.quantity}</p>
                      <p className="text-sm font-medium text-[#1a1a1a]">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-[#e0e0e0] pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#666]">Subtotal</span>
                  <span className="text-[#1a1a1a]">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#666]">Frete</span>
                  <span className="text-[#1a1a1a]">{shippingPrice > 0 ? formatCurrency(shippingPrice) : 'A calcular'}</span>
                </div>
                {pixDiscount > 0 && (
                  <div className="flex justify-between text-sm text-[#1a1a1a]">
                    <span>Desconto PIX (5%)</span>
                    <span>-{formatCurrency(pixDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-medium pt-2 border-t border-[#e0e0e0]">
                  <span className="text-[#1a1a1a]">Total</span>
                  <span className="text-[#1a1a1a]">{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Trust badges */}
              <div className="mt-6 pt-4 border-t border-[#e0e0e0]">
                <div className="flex items-center gap-2 text-sm text-[#666] mb-2">
                  <Lock className="w-4 h-4 text-[#1a1a1a]" />
                  <span>Pagamento 100% seguro</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#666] mb-2">
                  <Truck className="w-4 h-4 text-[#1a1a1a]" />
                  <span>Entrega para todo Brasil</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#666]">
                  <ShieldCheck className="w-4 h-4 text-[#1a1a1a]" />
                  <span>Garantia de 12 meses</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
