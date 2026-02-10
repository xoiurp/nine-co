"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";

interface ProductVariant {
  id: string;
  title: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  availableForSale: boolean;
  quantityAvailable?: number;
  selectedOptions?: { name: string; value: string }[];
}

interface ProductOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    title: string;
    handle: string;
    price: {
      amount: string;
      currencyCode: string;
    };
    compareAtPrice?: {
      amount: string;
      currencyCode: string;
    };
    image: string;
    images?: string[];
    variants: ProductVariant[];
    options?: { name: string; values: string[] }[];
  };
}

// Mapeamento de nome de cor para valor hex
const colorNameToHex: Record<string, string> = {
  // Português
  "preto": "#000000",
  "branco": "#FFFFFF",
  "vermelho": "#DC2626",
  "azul": "#2563EB",
  "azul marinho": "#1E3A5F",
  "azul claro": "#93C5FD",
  "azul royal": "#1D4ED8",
  "verde": "#16A34A",
  "verde escuro": "#166534",
  "verde militar": "#4B5320",
  "verde musgo": "#4A5D23",
  "amarelo": "#EAB308",
  "rosa": "#EC4899",
  "rosa claro": "#F9A8D4",
  "rosa pink": "#DB2777",
  "laranja": "#EA580C",
  "roxo": "#9333EA",
  "lilás": "#A855F7",
  "marrom": "#92400E",
  "marrom escuro": "#78350F",
  "bege": "#D4C4A8",
  "nude": "#E8C4A2",
  "cinza": "#6B7280",
  "cinza claro": "#D1D5DB",
  "cinza escuro": "#374151",
  "cinza chumbo": "#4B5563",
  "grafite": "#3F3F46",
  "vinho": "#722F37",
  "bordô": "#800020",
  "creme": "#FFFDD0",
  "caramelo": "#C68E17",
  "mostarda": "#DDAA33",
  "terracota": "#CC4E2A",
  "coral": "#FF6F61",
  "salmão": "#FA8072",
  "caqui": "#C3B091",
  "off-white": "#FAF9F6",
  "off white": "#FAF9F6",
  "jeans": "#4169E1",
  "denim": "#1560BD",
  "indigo": "#3F51B5",
  "turquesa": "#30D5C8",
  "menta": "#98FF98",
  "oliva": "#808000",
  "prata": "#C0C0C0",
  "dourado": "#DAA520",
  "ouro": "#FFD700",
  "camel": "#C19A6B",
  "chocolate": "#7B3F00",
  "areia": "#C2B280",
  "ferrugem": "#B7410E",
  "lavanda": "#E6E6FA",
  "petróleo": "#006666",
  "esmeralda": "#50C878",
  // Inglês
  "black": "#000000",
  "white": "#FFFFFF",
  "red": "#DC2626",
  "blue": "#2563EB",
  "navy": "#1E3A5F",
  "green": "#16A34A",
  "yellow": "#EAB308",
  "pink": "#EC4899",
  "orange": "#EA580C",
  "purple": "#9333EA",
  "brown": "#92400E",
  "beige": "#D4C4A8",
  "gray": "#6B7280",
  "grey": "#6B7280",
  "wine": "#722F37",
  "burgundy": "#800020",
  "cream": "#FFFDD0",
  "caramel": "#C68E17",
  "mustard": "#DDAA33",
  "coral": "#FF6F61",
  "salmon": "#FA8072",
  "khaki": "#C3B091",
  "indigo": "#3F51B5",
  "turquoise": "#30D5C8",
  "mint": "#98FF98",
  "olive": "#808000",
  "silver": "#C0C0C0",
  "gold": "#DAA520",
  "sand": "#C2B280",
  "lavender": "#E6E6FA",
  "teal": "#006666",
  "emerald": "#50C878",
  "charcoal": "#36454F",
  "ivory": "#FFFFF0",
  "tan": "#D2B48C",
  "rust": "#B7410E",
  "mauve": "#E0B0FF",
  "plum": "#8E4585",
  "taupe": "#483C32",
};

const getColorHex = (colorName: string): string => {
  if (!colorName) return "#cccccc";
  const lower = colorName.toLowerCase().trim();
  // Se já for hex ou rgb, retorna direto
  if (lower.startsWith("#") || lower.startsWith("rgb")) return colorName;
  return colorNameToHex[lower] || "#cccccc";
};

const ProductOptionsModal: React.FC<ProductOptionsModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const { addToCart } = useCart();
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    product.options?.forEach((option) => {
      initial[option.name] = option.values[0];
    });
    return initial;
  });

  const formatPrice = (amount: string, currencyCode: string = "BRL") => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: currencyCode,
    }).format(parseFloat(amount));
  };

  const findMatchingVariant = (): ProductVariant | undefined => {
    if (!product.options || product.options.length === 0) {
      return product.variants[0];
    }
    
    const matched = product.variants.find((variant) => {
      if (!variant.selectedOptions || variant.selectedOptions.length === 0) {
        return false;
      }
      return variant.selectedOptions.every(
        (opt) => selectedOptions[opt.name] === opt.value
      );
    });
    
    return matched || product.variants[0];
  };

  const selectedVariant = findMatchingVariant();
  const isAvailable = selectedVariant?.availableForSale ?? false;

  const handleOptionSelect = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: value,
    }));
  };

  const handleAddToCart = () => {
    if (!selectedVariant || !isAvailable) return;

    addToCart({
      id: selectedVariant.id,
      title: product.title,
      price: parseFloat(selectedVariant.price.amount),
      currencyCode: selectedVariant.price.currencyCode,
      image: product.image,
      variantId: selectedVariant.id,
      productId: product.id,
      handle: product.handle,
      quantity: 1,
      variantOptions: selectedVariant.selectedOptions,
    });

    onClose();
  };

  const handleBuyNow = () => {
    handleAddToCart();
    window.location.href = "/checkout";
  };

  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.image];

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 bg-white flex flex-col h-full">
        {/* Header */}
        <SheetHeader className="p-4 border-b border-[#e0e0e0] flex-shrink-0">
          <SheetTitle className="text-lg font-normal text-[#1a1a1a]">
            Escolher opções
          </SheetTitle>
        </SheetHeader>

        {/* Content - Flex layout to fit screen */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Product Image - Smaller aspect ratio */}
          <div className="relative w-full h-[180px] bg-white flex-shrink-0">
            <Image
              src={productImages[0]}
              alt={product.title}
              fill
              className="object-contain p-3"
            />
          </div>

          {/* Product Info & Options */}
          <div className="p-4 flex-1 overflow-y-auto">
            <h2 className="text-sm font-medium text-[#1a1a1a] uppercase tracking-wide mb-1">
              {product.title}
            </h2>
            
            <div className="flex items-center gap-2 mb-4">
              {product.compareAtPrice && (
                <span className="text-xs text-[#999] line-through">
                  {formatPrice(product.compareAtPrice.amount, product.compareAtPrice.currencyCode)}
                </span>
              )}
              <span className="text-sm font-medium text-[#1a1a1a]">
                {formatPrice(
                  selectedVariant?.price.amount || product.price.amount,
                  selectedVariant?.price.currencyCode || product.price.currencyCode
                )}
              </span>
            </div>

            {/* Options - Compact layout */}
            <div className="space-y-4">
              {product.options?.map((option) => (
                <div key={option.name}>
                  <label className="text-[10px] uppercase tracking-wider text-[#666] mb-2 block">
                    {option.name}: <span className="text-[#1a1a1a]">{selectedOptions[option.name]}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {option.values.map((value) => {
                      const isSelected = selectedOptions[option.name] === value;
                      const isColor = option.name.toLowerCase().includes("color") || 
                                       option.name.toLowerCase().includes("cor");
                      
                      if (isColor) {
                        const hexColor = getColorHex(value);
                        const isWhite = hexColor.toLowerCase() === "#ffffff" || hexColor.toLowerCase() === "#fffff0" || hexColor.toLowerCase() === "#faf9f6";
                        return (
                          <div key={value} className="flex flex-col items-center gap-1">
                            <button
                              onClick={() => handleOptionSelect(option.name, value)}
                              className={`w-7 h-7 border-2 transition-all ${
                                isSelected
                                  ? "border-[#1a1a1a] ring-1 ring-offset-1 ring-[#1a1a1a]"
                                  : isWhite
                                    ? "border-[#e0e0e0] hover:border-[#999]"
                                    : "border-transparent hover:border-[#ccc]"
                              }`}
                              style={{ backgroundColor: hexColor }}
                              title={value}
                            />
                            <span className="text-[10px] text-[#666]">{value}</span>
                          </div>
                        );
                      }

                      return (
                        <button
                          key={value}
                          onClick={() => handleOptionSelect(option.name, value)}
                          className={`min-w-[36px] h-8 px-2 text-xs border transition-all ${
                            isSelected
                              ? "border-[#1a1a1a] bg-[#1a1a1a] text-white"
                              : "border-[#e0e0e0] text-[#1a1a1a] hover:border-[#999]"
                          }`}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons - Fixed at bottom */}
          <div className="p-4 border-t border-[#e0e0e0] space-y-2 flex-shrink-0">
            <button
              onClick={handleAddToCart}
              disabled={!isAvailable}
              className={`w-full py-3 text-xs uppercase tracking-[0.15em] font-medium border transition-colors ${
                isAvailable
                  ? "border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white"
                  : "border-[#e0e0e0] text-[#999] cursor-not-allowed"
              }`}
            >
              {isAvailable ? "Adicionar ao carrinho" : "Indisponível"}
            </button>
            
            <button
              onClick={handleBuyNow}
              disabled={!isAvailable}
              className={`w-full py-3 text-xs uppercase tracking-[0.15em] font-medium transition-colors ${
                isAvailable
                  ? "bg-[#1a1a1a] text-white hover:bg-black"
                  : "bg-[#e0e0e0] text-[#999] cursor-not-allowed"
              }`}
            >
              Comprar agora
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProductOptionsModal;
