"use client";

import { useEffect, useState } from "react";
import HeroSection from "../components/layout/HeroSection";
import JustArrivedGrid from "../components/product/JustArrivedGrid";
import CollectionBanners from "../components/layout/CollectionBanners";
import SpecialCollections from "../components/layout/SpecialCollections";
import ContemporaryBanner from "../components/layout/ContemporaryBanner";
import WhatsNewGrid from "../components/product/WhatsNewGrid";
import VideoBanner from "../components/layout/VideoBanner";
import ItemOfTheWeek from "../components/product/ItemOfTheWeek";
import Testimonials from "../components/layout/Testimonials";
import { getProducts, getCollections, Product, Collection } from "../lib/shopify";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    async function fetchData() {
      const prodsData = await getProducts({ first: 12 });
      const colls = await getCollections();
      if (prodsData && prodsData.edges) {
        setProducts(prodsData.edges.map((edge) => edge.node));
      } else {
        setProducts([]);
      }
      setCollections(colls);
    }
    fetchData();
  }, []);

  return (
    <>
      {/* Hero Section - Full Screen */}
      <HeroSection />

      {/* Just Arrived - Product Grid Minimalista */}
      <JustArrivedGrid products={products} />

      {/* Collection Banners - Grid Layout */}
      <CollectionBanners collections={collections} />

      {/* Special Collections - 3 Columns */}
      <SpecialCollections collections={collections} />

      {/* Contemporary Banner - Split Screen */}
      <ContemporaryBanner 
        collection={collections.find(c => c.id.includes("272613802049"))} 
      />

      {/* What's New - Product Grid with Tabs */}
      <WhatsNewGrid collections={collections} />

      {/* 
      TESTE: Comente os componentes abaixo um por um para identificar qual está causando o círculo branco.
      Para comentar, adicione o símbolo de comentário antes e depois do componente, assim:
      {/* <VideoBanner /> *\/}
      */}

      {/* Video Banner with Countdown */}
      <VideoBanner />

      
      <ItemOfTheWeek product={products[0] || null} />

      {/* Testimonials */}
      <Testimonials />
    </>
  );
}