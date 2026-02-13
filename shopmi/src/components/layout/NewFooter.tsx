"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import logoIcon from "../../assets/images/logo-pico.svg";
import { getCollections, Collection } from "../../lib/shopify";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [shopCollections, setShopCollections] = useState<Collection[]>([]);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const collections = await getCollections();
        setShopCollections(collections.slice(0, 6));
      } catch (error) {
        console.error("Erro ao buscar coleções para o rodapé:", error);
      }
    };
    fetchCollections();
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const companyLinks = [
    { label: "Busca", href: "/search" },
    { label: "Contato", href: "/contato" },
    { label: "Termos e Condições", href: "/termos" },
    { label: "Política de Privacidade", href: "/privacidade" },
  ];

  const pagesLinks = [
    { label: "FAQ", href: "/faq" },
    { label: "Coleções", href: "/shop" },
  ];

  const socialLinks = [
    {
      label: "Instagram",
      href: "https://www.instagram.com/nineecia",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      label: "YouTube",
      href: "#",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      label: "TikTok",
      href: "#",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      ),
    },
    {
      label: "X",
      href: "#",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      label: "Vimeo",
      href: "#",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.01 7.522c-.179 0-.806.378-1.881 1.132L0 7.197c1.185-1.044 2.351-2.084 3.501-3.128C5.08 2.701 6.266 1.984 7.055 1.91c1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.507.539 2.45 1.131 3.674 1.776 3.674.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.614-2.061-.574 0-1.167.121-1.777.391 1.186-3.868 3.434-5.757 6.762-5.637 2.473.06 3.628 1.664 3.493 4.797l-.013.01z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="w-full bg-[#FFF5F7] text-gray-900">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Newsletter */}
          <div className="lg:col-span-5">
            <h3 className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#E8839B] font-semibold mb-4">
              Newsletter
            </h3>
            <p className="text-sm sm:text-base text-gray-700 mb-4">
              Cadastre-se e ganhe 10% de desconto na primeira compra
            </p>
            <form onSubmit={handleSubscribe} className="flex">
              <input
                type="email"
                placeholder="Seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white text-gray-900 px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none border border-[#F8C8D4] rounded-l-lg"
                required
              />
              <button
                type="submit"
                className="bg-[#FFB6C1] text-gray-900 px-6 py-3 text-xs tracking-[0.15em] uppercase font-medium hover:bg-[#F8A4B0] transition-colors rounded-r-lg"
              >
                Inscrever
              </button>
            </form>
            {subscribed && (
              <p className="text-xs text-green-600 mt-2">Obrigado por se inscrever!</p>
            )}
          </div>

          {/* Company Links */}
          <div className="lg:col-span-2">
            <h3 className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#E8839B] font-semibold mb-4">
              Institucional
            </h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-[#E8839B] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pages Links */}
          <div className="lg:col-span-2">
            <h3 className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#E8839B] font-semibold mb-4">
              Ajuda
            </h3>
            <ul className="space-y-2">
              {pagesLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-[#E8839B] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop Links - Dynamic Collections */}
          <div className="lg:col-span-3">
            <h3 className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#E8839B] font-semibold mb-4">
              Categorias
            </h3>
            <ul className="space-y-2">
              {shopCollections.map((collection) => (
                <li key={collection.id}>
                  <Link
                    href={`/shop/${collection.handle}`}
                    className="text-sm text-gray-600 hover:text-[#E8839B] transition-colors"
                  >
                    {collection.title}
                  </Link>
                </li>
              ))}
              {shopCollections.length === 0 && (
                <li>
                  <Link
                    href="/shop"
                    className="text-sm text-gray-600 hover:text-[#E8839B] transition-colors"
                  >
                    Ver todas
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 sm:mt-16 pt-10 border-t border-[#F8C8D4]">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            {/* Logo and Description */}
            <div className="flex-1">
              <Image
                src={logoIcon}
                alt="Ninē & CO"
                width={140}
                height={50}
                className="h-10 sm:h-12 w-auto mb-4"
              />
              <p className="text-xs sm:text-sm text-gray-500 max-w-md">
                Moda infantil com carinho e qualidade. Roupas confortáveis e estilosas para os pequenos brilharem.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E8839B] hover:text-[#D06080] transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-[#F8C8D4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
            <p>
              Copyright © {new Date().getFullYear()} Ninē & CO. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-2">
              {/* Payment Icons */}
              <Image src="/Assets/Images/Visa.svg" alt="Visa" width={36} height={24} className="h-5 w-auto" />
              <Image src="/Assets/Images/Mastercard.svg" alt="Mastercard" width={36} height={24} className="h-5 w-auto" />
              <Image src="/Assets/Images/pix.svg" alt="Pix" width={36} height={24} className="h-5 w-auto" />
              <Image src="/Assets/Images/PayPal.svg" alt="PayPal" width={36} height={24} className="h-5 w-auto" />
              <Image src="/Assets/Images/GooglePay.svg" alt="Google Pay" width={36} height={24} className="h-5 w-auto" />
              <Image src="/Assets/Images/DinersClub.svg" alt="Diners Club" width={36} height={24} className="h-5 w-auto" />
              <Image src="/Assets/Images/Discover.svg" alt="Discover" width={36} height={24} className="h-5 w-auto" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
