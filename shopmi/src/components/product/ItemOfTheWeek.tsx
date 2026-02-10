"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "../../lib/shopify";
import { useCart } from "../../context/CartContext";

interface ItemOfTheWeekProps {
  product: Product | null;
}

const ItemOfTheWeek: React.FC<ItemOfTheWeekProps> = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart, setCartSheetOpen } = useCart();

  // Extract dynamic sizes from product variants
  const availableSizes = useMemo(() => {
    if (!product?.variants?.edges) return [];
    const sizes = new Set<string>();
    product.variants.edges.forEach((edge) => {
      const sizeOpt = edge.node.selectedOptions?.find(
        (opt) => opt.name.toLowerCase() === "tamanho" || opt.name.toLowerCase() === "size"
      );
      if (sizeOpt) sizes.add(sizeOpt.value);
    });
    return Array.from(sizes);
  }, [product]);

  // Extract dynamic colors from product variants
  const availableColors = useMemo(() => {
    if (!product?.variants?.edges) return [];
    const colorMap = new Map<string, string>();
    product.variants.edges.forEach((edge) => {
      const colorOpt = edge.node.selectedOptions?.find(
        (opt) => opt.name.toLowerCase() === "cor" || opt.name.toLowerCase() === "color"
      );
      if (colorOpt && !colorMap.has(colorOpt.value)) {
        const hex = edge.node.metafield?.value || "#cccccc";
        colorMap.set(colorOpt.value, hex);
      }
    });
    return Array.from(colorMap, ([name, value]) => ({ name, value }));
  }, [product]);

  // Initialize selections
  React.useEffect(() => {
    if (availableSizes.length > 0 && !selectedSize) {
      setSelectedSize(availableSizes[0]);
    }
  }, [availableSizes, selectedSize]);

  React.useEffect(() => {
    if (availableColors.length > 0 && !selectedColor) {
      setSelectedColor(availableColors[0].name);
    }
  }, [availableColors, selectedColor]);

  if (!product) {
    return null;
  }

  const images = product.images?.edges || [];
  const currentImage = images[currentImageIndex]?.node;
  const price = product.priceRange?.minVariantPrice?.amount;
  const currency = product.priceRange?.minVariantPrice?.currencyCode;

  const handleAddToCart = () => {
    if (product.variants?.edges?.[0]?.node) {
      const variant = product.variants.edges[0].node;
      addToCart({
        id: variant.id,
        variantId: variant.id,
        quantity: quantity,
        title: product.title,
        price: parseFloat(variant.price.amount),
        currencyCode: variant.price.currencyCode,
        image: images[0]?.node?.transformedSrc || "",
        productId: product.id,
        handle: product.handle,
      });
      setCartSheetOpen(true);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const formatPrice = (amount: string) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(parseFloat(amount));
  };

  return (
    <div className="w-full bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Header */}
        <h2 className="text-3xl sm:text-4xl font-light text-[#1a1a1a] mb-8 sm:mb-12">
          Item da <span className="italic">semana</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left - Image Gallery */}
          <div>
            {/* Main Image Container */}
            <div className="relative aspect-square bg-white">
              {currentImage ? (
                <Image
                  src={currentImage.transformedSrc || ""}
                  alt={currentImage.altText || product.title}
                  fill
                  className="object-contain p-8"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#e0e0e0]">
                  <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#1a1a1a]/80 hover:bg-[#1a1a1a] flex items-center justify-center transition-colors text-white"
                    aria-label="Imagem anterior"
                    type="button"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#1a1a1a]/80 hover:bg-[#1a1a1a] flex items-center justify-center transition-colors text-white"
                    aria-label="Próxima imagem"
                    type="button"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <span className="text-xs text-[#666]">
                  {String(currentImageIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>

          {/* Right - Product Details */}
          <div className="flex flex-col">
            {/* Product Title */}
            <h3 className="text-sm sm:text-base font-medium text-[#1a1a1a] uppercase tracking-wide mb-1">
              {product.title}
            </h3>

            {/* Product Type */}
            <p className="text-[10px] sm:text-xs text-[#666] uppercase tracking-wider mb-4">
              {product.productType || "Destaque"}
            </p>

            {/* Price */}
            <p className="text-sm sm:text-base text-[#1a1a1a] mb-6">
              {price ? formatPrice(price) : "R$ 0,00"}{" "}
              <span className="text-xs text-[#999] ml-1">Impostos inclusos</span>
            </p>

            {/* Size Selector - Dynamic */}
            {availableSizes.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#666]">
                    Tamanho {selectedSize}
                  </span>
                  <button
                    type="button"
                    className="text-[10px] sm:text-xs uppercase tracking-wider text-[#999] hover:text-[#666] underline"
                  >
                    Guia de tamanhos
                  </button>
                </div>
                <div className="flex gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      type="button"
                      className={`w-10 h-10 text-xs font-medium border transition-colors ${
                        selectedSize === size
                          ? "border-[#1a1a1a] text-[#1a1a1a]"
                          : "border-[#e0e0e0] text-[#666] hover:border-[#999]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selector - Dynamic */}
            {availableColors.length > 0 && (
              <div className="mb-6">
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#666] block mb-2">
                  Cor {selectedColor}
                </span>
                <div className="flex gap-3">
                  {availableColors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      type="button"
                      className={`relative w-6 h-6 border-2 transition-transform ${
                        selectedColor === color.name
                          ? "border-[#1a1a1a] scale-110"
                          : "border-[#e0e0e0] hover:scale-105"
                      }`}
                      style={{ backgroundColor: color.value }}
                      aria-label={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Actions */}
            <div className="mt-auto">
              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center border border-[#e0e0e0]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    type="button"
                    className="w-10 h-10 flex items-center justify-center text-[#666] hover:bg-[#f5f5f5] transition-colors"
                  >
                    −
                  </button>
                  <span className="w-10 h-10 flex items-center justify-center text-sm text-[#1a1a1a]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    type="button"
                    className="w-10 h-10 flex items-center justify-center text-[#666] hover:bg-[#f5f5f5] transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                type="button"
                className="w-full py-4 bg-[#1a1a1a] text-white text-xs sm:text-sm tracking-[0.15em] uppercase font-medium hover:bg-black transition-colors"
              >
                Adicionar ao carrinho
              </button>

              {/* Buy It Now */}
              <button
                type="button"
                onClick={() => {
                  handleAddToCart();
                  setTimeout(() => { window.location.href = "/checkout"; }, 300);
                }}
                className="w-full py-4 border border-[#1a1a1a] text-[#1a1a1a] text-xs sm:text-sm tracking-[0.15em] uppercase font-medium hover:bg-[#1a1a1a] hover:text-white transition-colors mt-3"
              >
                Comprar agora
              </button>

              {/* View Product */}
              <Link
                href={`/product/${product.handle}`}
                className="block text-center text-[10px] sm:text-xs tracking-[0.15em] uppercase text-[#666] hover:text-[#1a1a1a] underline transition-colors py-4"
              >
                Ver produto
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemOfTheWeek;
