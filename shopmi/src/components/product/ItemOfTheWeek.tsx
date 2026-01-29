"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "../../lib/shopify";
import { useCart } from "../../context/CartContext";

interface ItemOfTheWeekProps {
  product: Product | null;
}

const SIZES = ["XS", "S", "M", "L"];
const COLORS = [
  { name: "Black", value: "#000000" },
  { name: "White", value: "#FFFFFF" },
];

const ItemOfTheWeek: React.FC<ItemOfTheWeekProps> = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState("XS");
  const [selectedColor, setSelectedColor] = useState("Black");
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addItem } = useCart();

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
      addItem({
        variantId: variant.id,
        quantity: quantity,
        title: product.title,
        price: parseFloat(variant.price.amount),
        image: images[0]?.node?.transformedSrc || "",
        productHandle: product.handle,
      });
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <section className="w-full py-12 sm:py-16 bg-[#f5f5f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-8 sm:mb-12">
          Item of the <span className="italic">week</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left - Image Gallery */}
          <div className="relative">
            {/* Main Image */}
            <div className="relative aspect-square bg-white overflow-hidden">
              {currentImage ? (
                <Image
                  src={currentImage.transformedSrc || currentImage.originalSrc || ""}
                  alt={currentImage.altText || product.title}
                  fill
                  className="object-contain p-8"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
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
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-sm transition-colors"
                    aria-label="Previous image"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-sm transition-colors"
                    aria-label="Next image"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  {String(currentImageIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>

          {/* Right - Product Details */}
          <div className="flex flex-col">
            {/* Product Title */}
            <h3 className="text-sm sm:text-base font-medium text-gray-900 uppercase tracking-wide mb-1">
              {product.title}
            </h3>

            {/* Theme */}
            <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider mb-4">
              Release Theme
            </p>

            {/* Price */}
            <p className="text-sm sm:text-base text-gray-900 mb-6">
              {currency === "BRL" ? "R$" : currency}{" "}
              {price
                ? parseFloat(price).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })
                : "0,00"}{" "}
              <span className="text-xs text-gray-400 ml-1">Taxes included</span>
            </p>

            {/* Size Selector */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-600">
                  Size {selectedSize}
                </span>
                <button className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-400 hover:text-gray-600 underline">
                  Size Guide
                </button>
              </div>
              <div className="flex gap-2">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-10 h-10 text-xs font-medium border transition-colors ${
                      selectedSize === size
                        ? "border-gray-900 text-gray-900"
                        : "border-gray-300 text-gray-600 hover:border-gray-500"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div className="mb-6">
              <span className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-600 block mb-2">
                Color {selectedColor}
              </span>
              <div className="flex gap-3">
                {COLORS.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-6 h-6 rounded-full border-2 transition-all ${
                      selectedColor === color.name
                        ? "border-gray-900 scale-110"
                        : "border-transparent hover:scale-105"
                    }`}
                    style={{ backgroundColor: color.value }}
                    aria-label={color.name}
                  >
                    {color.name === "White" && (
                      <span className="absolute inset-0 rounded-full border border-gray-200" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-3 mt-auto">
              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center border border-gray-300">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    −
                  </button>
                  <span className="w-10 h-10 flex items-center justify-center text-sm text-gray-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="w-full py-4 bg-black text-white text-xs sm:text-sm tracking-[0.15em] uppercase font-medium hover:bg-gray-800 transition-colors"
              >
                Add to Cart
              </button>

              {/* Buy It Now */}
              <button className="w-full py-4 border border-gray-900 text-gray-900 text-xs sm:text-sm tracking-[0.15em] uppercase font-medium hover:bg-gray-900 hover:text-white transition-colors">
                Buy It Now
              </button>

              {/* View Product */}
              <Link
                href={`/product/${product.handle}`}
                className="block text-center text-[10px] sm:text-xs tracking-[0.15em] uppercase text-gray-500 hover:text-gray-900 underline transition-colors py-2"
              >
                View Product
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ItemOfTheWeek;
