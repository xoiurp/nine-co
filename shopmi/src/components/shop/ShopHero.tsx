"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface ShopHeroProps {
  title?: string;
  subtitle?: string;
  breadcrumb?: {
    label: string;
    href: string;
  }[];
}

const ShopHero: React.FC<ShopHeroProps> = ({
  title = "Shop",
  subtitle = "Explore todos os nossos produtos.",
  breadcrumb = [
    { label: "HOME", href: "/" },
    { label: "SHOP", href: "/shop" },
  ],
}) => {
  return (
    <section className="relative w-full px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-4 sm:pb-6 lg:pb-8">
      <div className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl">
        <Image
          src="/banner-shop.webp"
          alt="Ninē & CO - Shop"
          width={1920}
          height={720}
          priority
          className="w-full h-auto object-cover"
          sizes="100vw"
        />
        {/* Clickable overlay */}
        <Link
          href="/shop"
          className="absolute inset-0"
          aria-label="Shop"
        />
      </div>
    </section>
  );
};

export default ShopHero;
