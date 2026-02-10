"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Product {
  id: string;
  title: string;
  handle: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
    };
  };
  images: {
    edges: {
      node: {
        originalSrc?: string;
        transformedSrc: string;
        altText: string | null;
      };
    }[];
  };
}

interface Props {
  products: Product[];
}

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = Math.floor(timeLeft / 3600).toString().padStart(2, "0");
  const minutes = Math.floor((timeLeft % 3600) / 60).toString().padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");

  return (
    <div className="flex items-center space-x-2">
      <span className="bg-white text-black font-bold text-xl px-4 py-2">{hours}</span>
      <span className="text-white text-xl font-bold">:</span>
      <span className="bg-white text-black font-bold text-xl px-4 py-2">{minutes}</span>
      <span className="text-white text-xl font-bold">:</span>
      <span className="bg-white text-black font-bold text-xl px-4 py-2">{seconds}</span>
    </div>
  );
};

const ExclusiveOffersSlider = ({ products }: Props) => {
  return (
    <div className="exclusive-offers-slider">
    <section className="py-12">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center bg-black text-white px-6 py-4 mb-8">
          <h2 className="text-2xl md:text-3xl font-light uppercase tracking-wide mb-4 sm:mb-0">Ofertas Exclusivas</h2>
          <Countdown />
        </div>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          slidesPerView={1}
          spaceBetween={30}
          navigation
          loop
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
          }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          className="w-full"
        >
          {products.slice(0, 8).map((product) => (
            <SwiperSlide key={product.id}>
              <div className="flex flex-col p-4 hover:shadow-sm transition-shadow">
                <div className="relative w-full h-48 mb-4 overflow-hidden">
                  {product.images.edges[0]?.node.transformedSrc ? (
                    <Image
                      src={product.images.edges[0].node.transformedSrc}
                      alt={product.images.edges[0].node.altText || product.title}
                      fill={true}
                      className="object-contain hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#f5f5f5]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-[#e0e0e0]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="text-left w-full">
                  <h3 className="font-medium text-[#1a1a1a] mb-2 line-clamp-2 h-10 text-sm uppercase tracking-wide">{product.title}</h3>
                  <p className="text-[#1a1a1a] font-medium text-sm mb-4">
                    R$ {parseFloat(product.priceRange.minVariantPrice.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                  <Link
                    href={`/product/${product.handle}`}
                    className="bg-[#1a1a1a] text-white w-full py-2.5 hover:bg-black transition-colors font-medium text-xs uppercase tracking-[0.15em] text-center block"
                  >
                    Comprar
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
    </div>
  );
};

export default ExclusiveOffersSlider;
