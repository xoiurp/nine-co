"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section 
      className="relative w-full h-screen min-h-[600px] overflow-hidden"
      style={{ 
        outline: 'none', 
        boxShadow: 'none',
        border: 'none',
        position: 'relative'
      }}
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0"
        style={{ 
          outline: 'none', 
          boxShadow: 'none',
          border: 'none'
        }}
      >
        <Image
          src="/hero-section.webp"
          alt="Hero Background"
          fill
          priority
          className="object-cover object-top"
          sizes="100vw"
          unoptimized
        />
        {/* Overlay */}
        <div 
          className="absolute inset-0 bg-black/10"
          style={{ pointerEvents: 'none' }}
        />
      </div>

      {/* Content */}
      <div 
        className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-4"
        style={{ 
          outline: 'none', 
          boxShadow: 'none',
          border: 'none'
        }}
      >
        {/* Main Content - Bottom aligned */}
        <div 
          className="mt-auto mb-24 sm:mb-32 md:mb-40"
          style={{ 
            outline: 'none', 
            boxShadow: 'none',
            border: 'none'
          }}
        >
          {/* Subtitle */}
          <p className="text-[10px] sm:text-xs tracking-[0.4em] uppercase mb-4 sm:mb-6 opacity-90">
            SS26 Statement Pieces
          </p>

          {/* Main Title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight mb-8 sm:mb-10">
            Bold by design
          </h1>

          {/* CTA Button */}
          <Link
            href="/shop"
            className="inline-block px-8 sm:px-10 py-3 sm:py-4 border border-white/80 rounded-full text-[10px] sm:text-xs tracking-[0.3em] uppercase font-medium hover:bg-white hover:text-black transition-all duration-300"
            style={{ outline: 'none', boxShadow: 'none' }}
          >
            Discover More
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
