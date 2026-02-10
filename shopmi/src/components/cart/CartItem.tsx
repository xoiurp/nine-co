'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart, CartItem as CartItemType } from '../../context/CartContext';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const formatPrice = (price: number, currencyCode: string = 'BRL') => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currencyCode,
    }).format(price);
  };

  return (
    <div className="flex py-4 border-b border-[#e0e0e0] last:border-b-0">
      {/* Product Image */}
      <Link href={`/product/${item.handle}`} className="flex-shrink-0 w-24 h-24 relative bg-white border border-[#e0e0e0] mr-4">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="96px"
            className="object-contain p-1"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#e0e0e0]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </Link>

      {/* Product Details */}
      <div className="flex-grow flex flex-col justify-between min-w-0">
        {/* Top Info */}
        <div>
          {item.category && (
            <p className="text-[10px] uppercase tracking-[0.15em] text-[#999] mb-1">{item.category}</p>
          )}
          <Link href={`/product/${item.handle}`}>
            <h3 className="text-sm font-medium text-[#1a1a1a] uppercase tracking-wide line-clamp-2 hover:underline">
              {item.title}
            </h3>
          </Link>
          {item.variantOptions && item.variantOptions.length > 0 && (
            <p className="text-xs text-[#666] mt-1">
              {item.variantOptions.map(opt => `${opt.name}: ${opt.value}`).join(' / ')}
            </p>
          )}
        </div>

        {/* Bottom: Quantity + Price */}
        <div className="flex justify-between items-end mt-3">
          {/* Quantity Controls */}
          <div className="flex items-center border border-[#e0e0e0]">
            <button
              onClick={(e) => { e.preventDefault(); updateQuantity(item.id, Math.max(0, item.quantity - 1)); }}
              className="w-8 h-8 flex items-center justify-center text-[#666] hover:bg-[#f5f5f5] transition-colors"
              aria-label="Diminuir quantidade"
            >
              <Minus size={14} />
            </button>
            <span className="w-8 text-center text-sm text-[#1a1a1a]">
              {item.quantity}
            </span>
            <button
              onClick={(e) => { e.preventDefault(); updateQuantity(item.id, item.quantity + 1); }}
              className="w-8 h-8 flex items-center justify-center text-[#666] hover:bg-[#f5f5f5] transition-colors"
              aria-label="Aumentar quantidade"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            {item.compareAtPrice && parseFloat(item.compareAtPrice.amount) > item.price && (
              <div className="text-xs text-[#999] line-through">
                {formatPrice(parseFloat(item.compareAtPrice.amount) * item.quantity, item.compareAtPrice.currencyCode)}
              </div>
            )}
            <div className="text-sm font-medium text-[#1a1a1a]">
              {formatPrice(item.price * item.quantity, item.currencyCode)}
            </div>
          </div>
        </div>
      </div>

      {/* Remove Button */}
      <div className="flex items-start ml-3">
        <button
          onClick={() => removeFromCart(item.id)}
          className="p-1 text-[#999] hover:text-[#1a1a1a] transition-colors"
          aria-label="Remover item"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
