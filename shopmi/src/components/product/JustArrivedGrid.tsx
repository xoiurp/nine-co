"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "../../lib/shopify";

interface JustArrivedGridProps {
  products: Product[];
}

const JustArrivedGrid: React.FC<JustArrivedGridProps> = ({ products }) => {
  // Pegar os 4 primeiros produtos
  const displayProducts = products.slice(0, 4);

  return (
    <section className="w-full py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-gray-900">
            Just arrived
          </h2>

          <div className="flex items-center gap-4">
            <Link
              href="/shop"
              className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-gray-500 hover:text-gray-900 transition-colors border-b border-gray-300 hover:border-gray-900 pb-0.5"
            >
              View All
            </Link>

            {/* Navigation Arrows */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
                aria-label="Previous"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                className="w-8 h-8 flex items-center justify-center text-gray-900 hover:text-gray-600 transition-colors"
                aria-label="Next"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayProducts.map((product) => {
            const price = product.priceRange?.minVariantPrice?.amount;
            const currency = product.priceRange?.minVariantPrice?.currencyCode;
            const image = product.images?.edges?.[0]?.node;
            
            // Contar variantes/cores disponíveis
            const variantCount = product.variants?.edges?.length || 1;
            const hasMultipleColors = variantCount > 1;

            return (
              <Link
                key={product.id}
                href={`/product/${product.handle}`}
                className="group block"
              >
                {/* Image Container */}
                <div className="relative aspect-[3/4] bg-white overflow-hidden mb-4">
                  {image ? (
                    <Image
                      src={image.transformedSrc || image.originalSrc || ""}
                      alt={image.altText || product.title}
                      fill
                      className="object-contain object-center group-hover:scale-105 transition-transform duration-500 p-4"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <svg
                        className="w-12 h-12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="space-y-1">
                  {/* Product Name */}
                  <h3 className="text-[11px] sm:text-xs tracking-wide uppercase text-gray-900 font-normal">
                    {product.title}
                  </h3>

                  {/* Price */}
                  <p className="text-[11px] sm:text-xs text-gray-600">
                    {currency === "BRL" ? "R$" : currency}{" "}
                    {price
                      ? parseFloat(price).toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : "0,00"}
                  </p>

                  {/* Availability Info */}
                  <p className="text-[10px] text-gray-400">
                    {hasMultipleColors
                      ? `Available in ${variantCount} color${variantCount > 1 ? "s" : ""}`
                      : "Available in 1 color"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default JustArrivedGrid;
