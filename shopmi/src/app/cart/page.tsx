"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Minus, Trash2, ArrowLeft } from "lucide-react";
import { useCart } from "../../context/CartContext";

export default function CartPage() {
  const {
    cart,
    totalItems,
    totalPrice,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const formatPrice = (price: number | string, currencyCode: string = "BRL") => {
    const numericPrice = typeof price === "string" ? parseFloat(price) : price;
    if (isNaN(numericPrice)) return "Preço inválido";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: currencyCode,
    }).format(numericPrice);
  };

  // Free shipping threshold
  const FREE_SHIPPING_THRESHOLD = 450;
  const amountForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - totalPrice);
  const freeShippingProgress = Math.min(100, (totalPrice / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className="min-h-screen bg-white pt-[140px] md:pt-[160px]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-light text-[#1a1a1a]">
            Seu carrinho
            {totalItems > 0 && (
              <span className="text-base font-normal text-[#666] ml-2">
                ({totalItems} {totalItems === 1 ? "item" : "itens"})
              </span>
            )}
          </h1>
          <Link
            href="/shop"
            className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-[#666] hover:text-[#1a1a1a] transition-colors"
          >
            <ArrowLeft size={16} />
            Continuar comprando
          </Link>
        </div>

        {/* Free shipping progress */}
        {cart.length > 0 && (
          <div className="mb-8 p-4 border border-[#e0e0e0]">
            {amountForFreeShipping > 0 ? (
              <>
                <p className="text-sm text-[#666] mb-3">
                  Gaste{" "}
                  <span className="font-medium text-[#1a1a1a]">
                    {formatPrice(amountForFreeShipping)}
                  </span>{" "}
                  mais para frete grátis
                </p>
                <div className="w-full h-1 bg-[#e0e0e0]">
                  <div
                    className="h-full bg-[#1a1a1a] transition-all duration-500"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </>
            ) : (
              <p className="text-sm text-[#1a1a1a] font-medium flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Parabéns! Você ganhou frete grátis
              </p>
            )}
          </div>
        )}

        {cart.length === 0 ? (
          /* Empty Cart */
          <div className="flex flex-col items-center justify-center py-20">
            <svg
              className="h-20 w-20 mb-6 text-[#e0e0e0]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <p className="text-lg font-medium text-[#1a1a1a] mb-2">
              Seu carrinho está vazio
            </p>
            <p className="text-sm text-[#666] mb-8">
              Adicione produtos para continuar
            </p>
            <Link
              href="/shop"
              className="px-8 py-3 bg-[#1a1a1a] text-white text-xs uppercase tracking-[0.15em] font-medium hover:bg-black transition-colors"
            >
              Explorar produtos
            </Link>
          </div>
        ) : (
          /* Cart Content */
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-12">
            {/* Cart Items */}
            <div>
              {/* Table Header - Desktop */}
              <div className="hidden sm:grid grid-cols-[1fr_120px_120px_40px] gap-4 pb-4 border-b border-[#e0e0e0] text-[10px] uppercase tracking-[0.15em] text-[#666] font-medium">
                <span>Produto</span>
                <span className="text-center">Quantidade</span>
                <span className="text-right">Total</span>
                <span></span>
              </div>

              {/* Items */}
              <div className="divide-y divide-[#e0e0e0]">
                {cart.map((item) => (
                  <div
                    key={item.variantId}
                    className="py-6 grid grid-cols-1 sm:grid-cols-[1fr_120px_120px_40px] gap-4 items-center"
                  >
                    {/* Product Info */}
                    <div className="flex gap-4">
                      <Link
                        href={`/product/${item.handle}`}
                        className="flex-shrink-0 w-24 h-28 bg-white relative overflow-hidden border border-[#e0e0e0]"
                      >
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-contain p-2"
                        />
                      </Link>
                      <div className="flex flex-col justify-center min-w-0">
                        <Link
                          href={`/product/${item.handle}`}
                          className="text-sm font-medium text-[#1a1a1a] uppercase tracking-wide hover:underline line-clamp-2"
                        >
                          {item.title}
                        </Link>
                        <p className="mt-1 text-sm text-[#666]">
                          {formatPrice(item.price, item.currencyCode)}
                        </p>
                        {item.variantOptions && item.variantOptions.length > 0 && (
                          <p className="mt-1 text-xs text-[#999]">
                            {item.variantOptions.map((opt) => opt.value).join(" · ")}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-center sm:justify-center">
                      <div className="flex items-center border border-[#e0e0e0]">
                        <button
                          onClick={() =>
                            updateQuantity(item.variantId, Math.max(0, item.quantity - 1))
                          }
                          className="w-9 h-9 flex items-center justify-center text-[#666] hover:bg-[#f5f5f5] transition-colors"
                          aria-label="Diminuir quantidade"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-9 text-center text-sm text-[#1a1a1a]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="w-9 h-9 flex items-center justify-center text-[#666] hover:bg-[#f5f5f5] transition-colors"
                          aria-label="Aumentar quantidade"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Line Total */}
                    <span className="text-sm font-medium text-[#1a1a1a] text-right">
                      {formatPrice(item.price * item.quantity, item.currencyCode)}
                    </span>

                    {/* Remove */}
                    <div className="flex justify-end">
                      <button
                        onClick={() => removeFromCart(item.variantId)}
                        className="p-1 text-[#999] hover:text-[#1a1a1a] transition-colors"
                        aria-label="Remover item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:sticky lg:top-[180px] self-start">
              <div className="border border-[#e0e0e0] p-6">
                <h2 className="text-sm uppercase tracking-[0.15em] font-medium text-[#1a1a1a] mb-6">
                  Resumo do pedido
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#666]">Subtotal</span>
                    <span className="text-sm text-[#1a1a1a]">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#666]">Frete</span>
                    <span className="text-sm text-[#999]">
                      Calculado no checkout
                    </span>
                  </div>
                </div>

                <div className="border-t border-[#e0e0e0] pt-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-[#1a1a1a]">
                      Total
                    </span>
                    <span className="text-lg font-medium text-[#1a1a1a]">
                      {formatPrice(totalPrice)}{" "}
                      <span className="text-xs font-normal text-[#666]">BRL</span>
                    </span>
                  </div>
                  <p className="text-xs text-[#999] mt-1">
                    Taxas incluídas
                  </p>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full py-4 bg-[#1a1a1a] text-white text-xs text-center uppercase tracking-[0.15em] font-medium hover:bg-black transition-colors"
                >
                  Finalizar compra
                </Link>

                <p className="text-[10px] text-[#999] text-center mt-4">
                  Ao continuar, você aceita nossos{" "}
                  <Link href="/termos" className="underline hover:text-[#666]">
                    termos de venda
                  </Link>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
