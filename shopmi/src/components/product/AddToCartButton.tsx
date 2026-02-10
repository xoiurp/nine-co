'use client';

import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { CartItem } from '../../context/CartContext';
import { VariantOption } from '../../context/CartContext';

interface Product {
  id: string;
  title: string;
  price: number;
  currencyCode: string;
  image: string;
  variantId: string | null;
  productId: string;
  handle: string;
  category?: string;
  variantOptions?: VariantOption[];
  compareAtPrice?: { amount: string; currencyCode: string } | null;
  tags?: string[];
}

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  className?: string;
  disabled?: boolean;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  quantity = 1,
  className = '',
  disabled = false,
}) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    if (disabled || !product.variantId) {
      return;
    }

    setIsAdding(true);

    const itemToAdd: CartItem = {
      id: product.variantId as string,
      title: product.title,
      price: product.price,
      currencyCode: product.currencyCode,
      quantity: quantity,
      image: product.image,
      variantId: product.variantId as string,
      productId: product.productId,
      category: product.category,
      variantOptions: product.variantOptions,
      compareAtPrice: product.compareAtPrice,
      tags: product.tags,
      handle: product.handle,
    };

    addToCart(itemToAdd);

    setTimeout(() => {
      setIsAdding(false);
    }, 1500);
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={disabled || isAdding}
      className={`w-full py-4 text-xs uppercase tracking-[0.15em] font-medium flex justify-center items-center transition-colors ${
        disabled || isAdding
          ? 'bg-[#e0e0e0] text-[#999] cursor-not-allowed'
          : 'bg-[#1a1a1a] text-white hover:bg-black cursor-pointer'
      } ${className}`}
    >
      {isAdding ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Adicionando...
        </>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          Adicionar ao carrinho
        </>
      )}
    </button>
  );
};

export default AddToCartButton;
