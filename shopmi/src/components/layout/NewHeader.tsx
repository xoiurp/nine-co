"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import CartDrawerContent from "../cart/CartDrawer";
import logoIcon from "../../assets/images/logo-pico.svg";

// Countdown Timer Component
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 23,
    hours: 1,
    minutes: 44,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  return (
    <span className="font-mono text-xs tracking-wider">
      ENDS IN {timeLeft.days}D | {formatNumber(timeLeft.hours)}H | {formatNumber(timeLeft.minutes)}M | {formatNumber(timeLeft.seconds)}S
    </span>
  );
};

const NewHeader = () => {
  const router = useRouter();
  const { totalItems, isCartSheetOpen, setCartSheetOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top Bar - Always visible */}
      <div
        className={`transition-all duration-300 ${
          isScrolled
            ? "bg-white text-gray-900 border-b border-gray-200"
            : "bg-black/30 text-white backdrop-blur-sm"
        }`}
      >
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-[10px] sm:text-xs tracking-widest uppercase font-medium">
            {/* Left - Our Stores */}
            <div className="hidden sm:block">
              <Link
                href="#"
                className={`hover:opacity-70 transition-opacity ${
                  isScrolled ? "text-gray-900" : "text-white"
                }`}
              >
                Our Stores
              </Link>
            </div>

            {/* Center - Welcome */}
            <div className="flex items-center gap-2 mx-auto sm:mx-0">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>Welcome to our store</span>
            </div>

            {/* Right - New Products + Countdown */}
            <div className="hidden sm:flex items-center gap-4">
              <span className="flex items-center gap-2">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                  />
                </svg>
                New Products
              </span>
              <CountdownTimer />
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div
        className={`transition-all duration-500 ${
          isScrolled
            ? "bg-white shadow-md"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Desktop Navigation - Left */}
            <nav className="hidden lg:flex items-center gap-8">
              <NavigationMenu>
                <NavigationMenuList className="gap-6">
                  <NavigationMenuItem>
                    <Link
                      href="/"
                      className={`text-xs tracking-widest uppercase font-medium transition-colors hover:opacity-70 ${
                        isScrolled ? "text-gray-900" : "text-white"
                      }`}
                    >
                      Home
                    </Link>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuTrigger
                      className={`text-xs tracking-widest uppercase font-medium bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent transition-colors hover:opacity-70 ${
                        isScrolled
                          ? "text-gray-900"
                          : "text-white"
                      }`}
                    >
                      Shop
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="w-[400px] p-6 bg-white">
                        <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider">
                          Categorias
                        </h3>
                        <ul className="space-y-3">
                          <li>
                            <Link
                              href="/shop"
                              className="text-sm text-gray-600 hover:text-gray-900"
                            >
                              Todos os Produtos
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/shop/smartwatches"
                              className="text-sm text-gray-600 hover:text-gray-900"
                            >
                              Smartwatches
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/shop/audio"
                              className="text-sm text-gray-600 hover:text-gray-900"
                            >
                              Áudio
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/shop/casa-inteligente"
                              className="text-sm text-gray-600 hover:text-gray-900"
                            >
                              Casa Inteligente
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuTrigger
                      className={`text-xs tracking-widest uppercase font-medium bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent transition-colors hover:opacity-70 ${
                        isScrolled
                          ? "text-gray-900"
                          : "text-white"
                      }`}
                    >
                      Pages
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="w-[300px] p-6 bg-white">
                        <ul className="space-y-3">
                          <li>
                            <Link
                              href="/faq"
                              className="text-sm text-gray-600 hover:text-gray-900"
                            >
                              FAQ
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/envio"
                              className="text-sm text-gray-600 hover:text-gray-900"
                            >
                              Envio e Entrega
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/politica-de-devolucao"
                              className="text-sm text-gray-600 hover:text-gray-900"
                            >
                              Política de Devolução
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuTrigger
                      className={`text-xs tracking-widest uppercase font-medium bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent transition-colors hover:opacity-70 ${
                        isScrolled
                          ? "text-gray-900"
                          : "text-white"
                      }`}
                    >
                      Product Features
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="w-[300px] p-6 bg-white">
                        <ul className="space-y-3">
                          <li>
                            <span className="text-sm text-gray-600">
                              Lançamentos
                            </span>
                          </li>
                          <li>
                            <span className="text-sm text-gray-600">
                              Mais Vendidos
                            </span>
                          </li>
                          <li>
                            <span className="text-sm text-gray-600">
                              Ofertas Especiais
                            </span>
                          </li>
                        </ul>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <Link
                      href="/contact"
                      className={`text-xs tracking-widest uppercase font-medium transition-colors hover:opacity-70 ${
                        isScrolled ? "text-gray-900" : "text-white"
                      }`}
                    >
                      Contact
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </nav>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <button
                    className={`p-2 transition-colors ${
                      isScrolled ? "text-gray-900" : "text-white"
                    }`}
                    aria-label="Menu"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] p-0">
                  <SheetHeader className="p-6 border-b">
                    <SheetTitle>
                      <Link href="/" className="flex items-center">
                        <Image
                          src={logoIcon}
                          alt="Logo"
                          width={120}
                          height={40}
                          className="h-8 w-auto object-contain"
                          priority
                        />
                      </Link>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="p-6">
                    <nav className="space-y-4">
                      <Link
                        href="/"
                        className="block text-sm font-medium text-gray-900 hover:text-gray-600"
                      >
                        Home
                      </Link>
                      <Link
                        href="/shop"
                        className="block text-sm font-medium text-gray-900 hover:text-gray-600"
                      >
                        Shop
                      </Link>
                      <Link
                        href="/faq"
                        className="block text-sm font-medium text-gray-900 hover:text-gray-600"
                      >
                        FAQ
                      </Link>
                      <Link
                        href="/contact"
                        className="block text-sm font-medium text-gray-900 hover:text-gray-600"
                      >
                        Contact
                      </Link>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Logo - Center */}
            <Link href="/" className="absolute left-1/2 transform -translate-x-1/2">
              <Image
                src={logoIcon}
                alt="Logo"
                width={140}
                height={50}
                className={`h-8 sm:h-10 w-auto object-contain transition-all duration-300 ${
                  isScrolled ? "brightness-100" : "brightness-0 invert"
                }`}
                priority
              />
            </Link>

            {/* Right Icons */}
            <div className="flex items-center gap-4">
              {/* Country/Region Selector */}
              <button
                className={`hidden sm:flex items-center gap-1 text-xs font-medium transition-colors hover:opacity-70 ${
                  isScrolled ? "text-gray-900" : "text-white"
                }`}
              >
                <span className="text-base">🇺🇸</span>
                <span className="hidden md:inline uppercase tracking-wider">
                  United States
                </span>
              </button>

              {/* Search */}
              <form onSubmit={handleSearch} className="hidden md:block relative">
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-0 focus:w-40 transition-all duration-300 bg-transparent border-b text-sm py-1 focus:outline-none ${
                    isScrolled
                      ? "border-gray-300 text-gray-900 placeholder-gray-500"
                      : "border-white/50 text-white placeholder-white/70"
                  }`}
                />
                <button
                  type="submit"
                  className={`transition-colors hover:opacity-70 ${
                    isScrolled ? "text-gray-900" : "text-white"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </form>

              {/* Search Mobile */}
              <button
                className={`md:hidden transition-colors hover:opacity-70 ${
                  isScrolled ? "text-gray-900" : "text-white"
                }`}
                onClick={() => router.push("/search")}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>

              {/* Account */}
              <Link
                href="/dashboard"
                className={`transition-colors hover:opacity-70 ${
                  isScrolled ? "text-gray-900" : "text-white"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </Link>

              {/* Cart */}
              <Sheet open={isCartSheetOpen} onOpenChange={setCartSheetOpen}>
                <SheetTrigger asChild>
                  <button
                    className={`relative transition-colors hover:opacity-70 ${
                      isScrolled ? "text-gray-900" : "text-white"
                    }`}
                    aria-label="Carrinho"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    {totalItems > 0 && (
                      <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </button>
                </SheetTrigger>
                <SheetContent
                  className="w-full md:max-w-md p-0 flex flex-col"
                  side="right"
                >
                  <div className="p-4 pt-8 border-b">
                    <SheetTitle className="text-center text-lg font-semibold mb-1">
                      Meu Carrinho ({totalItems})
                    </SheetTitle>
                    <div className="text-center">
                      <Link
                        href="/cart"
                        className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
                      >
                        Ver Todos
                      </Link>
                    </div>
                  </div>
                  <CartDrawerContent />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NewHeader;
