"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="relative w-full px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-4 sm:pb-6 lg:pb-8">
      {/* Banner Image - with padding and rounded corners */}
      <div className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl">
        <Image
          src="/hero-section-banner.png"
          alt="Ninē & CO - Moda Infantil para Brincar e Crescer"
          width={1920}
          height={720}
          priority
          className="w-full h-auto object-cover"
          sizes="100vw"
        />
        {/* Clickable overlay - entire banner links to shop */}
        <Link
          href="/shop"
          className="absolute inset-0"
          aria-label="Comprar agora"
        />
      </div>
    </section>
  );
};

export default HeroSection;
