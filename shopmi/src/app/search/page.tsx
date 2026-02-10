"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search as SearchIcon, ArrowRight } from "lucide-react";
import {
  searchProducts,
  getCollections,
  getProducts,
  Product,
  PageInfo,
  Collection,
} from "../../lib/shopify";
import ShopProductCard from "../../components/shop/ShopProductCard";

const ITEMS_PER_PAGE = 20;

// ─── Fuzzy matching / "Você quis dizer?" ────────────────────────────────────

// Levenshtein distance between two strings
function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  // Use a single flat array for the DP matrix (2 rows)
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  let curr = new Array(n + 1);

  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

// Find best suggestion from a dictionary of known terms
function findSuggestion(
  query: string,
  dictionary: string[]
): string | null {
  if (!query || dictionary.length === 0) return null;

  const q = query.toLowerCase().trim();
  if (q.length < 3) return null;

  let bestMatch: string | null = null;
  let bestScore = Infinity;

  // Maximum allowed distance scales with query length
  // Short words (3-4 chars): max 1 edit; medium (5-7): max 2; long (8+): max 3
  const maxDistance = q.length <= 4 ? 1 : q.length <= 7 ? 2 : 3;

  for (const term of dictionary) {
    const t = term.toLowerCase();

    // Skip exact matches — no suggestion needed
    if (t === q) return null;

    // Skip if the term is a substring of the query or vice-versa (already matches)
    if (t.includes(q) || q.includes(t)) return null;

    // Check: does the term start with the query? (partial typing, e.g. "camise" → "camiseta")
    if (t.startsWith(q) && t.length > q.length) {
      const lengthDiff = t.length - q.length;
      if (lengthDiff < bestScore) {
        bestScore = lengthDiff;
        bestMatch = term;
      }
      continue;
    }

    // Check: does the query start with the term? (overtyping)
    if (q.startsWith(t) && q.length > t.length) {
      const lengthDiff = q.length - t.length;
      if (lengthDiff <= 2 && lengthDiff < bestScore) {
        bestScore = lengthDiff;
        bestMatch = term;
      }
      continue;
    }

    // Levenshtein distance
    const dist = levenshtein(q, t);
    if (dist <= maxDistance && dist < bestScore) {
      bestScore = dist;
      bestMatch = term;
    }
  }

  return bestMatch;
}

// Build a search dictionary from collections, products, and common terms
function buildDictionary(
  collections: Collection[],
  products: Product[],
  catalogProducts: Product[]
): string[] {
  const terms = new Set<string>();

  // Collection titles
  for (const c of collections) {
    terms.add(c.title);
    // Also add individual words from multi-word titles
    for (const word of c.title.split(/\s+/)) {
      if (word.length >= 3) terms.add(word);
    }
  }

  // Product titles, tags, productTypes from search results
  for (const p of products) {
    terms.add(p.title);
    for (const word of p.title.split(/\s+/)) {
      if (word.length >= 3) terms.add(word);
    }
    if (p.tags) {
      for (const tag of p.tags) terms.add(tag);
    }
    if (p.productType) terms.add(p.productType);
  }

  // Catalog products (broader set for when search returns 0 results)
  for (const p of catalogProducts) {
    terms.add(p.title);
    for (const word of p.title.split(/\s+/)) {
      if (word.length >= 3) terms.add(word);
    }
    if (p.tags) {
      for (const tag of p.tags) terms.add(tag);
    }
    if (p.productType) terms.add(p.productType);
  }

  return Array.from(terms);
}

// ─── Product helpers ─────────────────────────────────────────────────────────

const isPreOrder = (product: Product): boolean => {
  return (
    product.tags?.some(
      (tag) =>
        tag.toLowerCase().includes("pre-order") ||
        tag.toLowerCase().includes("preorder") ||
        tag.toLowerCase().includes("pré-venda") ||
        tag.toLowerCase().includes("prevenda")
    ) || false
  );
};

const extractColors = (product: Product): string[] => {
  if (!product.variants?.edges) return [];

  const colors = product.variants.edges
    .map((edge) => {
      if (!edge?.node) return null;
      const metafieldColor = edge.node.metafield?.value;
      if (metafieldColor) return metafieldColor;
      const variantTitle = edge.node.title;
      if (variantTitle && typeof variantTitle === "string") {
        const titleParts = variantTitle.split("/");
        if (titleParts.length > 1) {
          return titleParts[titleParts.length - 1].trim();
        }
      }
      return null;
    })
    .filter((color): color is string => typeof color === "string");

  return Array.from(new Set(colors));
};

// ─── Search page component ──────────────────────────────────────────────────

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [matchingCollections, setMatchingCollections] = useState<Collection[]>(
    []
  );
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(query);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  // Cache catalog products so we don't refetch every search
  const catalogRef = useRef<Product[]>([]);
  const catalogLoadedRef = useRef(false);

  useEffect(() => {
    setSearchTerm(query);
  }, [query]);

  // Search products
  useEffect(() => {
    const fetchAll = async () => {
      if (!query) {
        setProducts([]);
        setPageInfo(null);
        setMatchingCollections([]);
        setSuggestion(null);
        return;
      }

      setLoading(true);
      setPageInfo(null);
      setSuggestion(null);

      try {
        // Build requests: products search + collections + catalog (once)
        const requests: [
          Promise<Awaited<ReturnType<typeof searchProducts>>>,
          Promise<Collection[]>,
          Promise<Awaited<ReturnType<typeof getProducts>> | null>,
        ] = [
          searchProducts({ queryText: query, first: ITEMS_PER_PAGE }),
          getCollections(),
          !catalogLoadedRef.current
            ? getProducts({ first: 50 })
            : Promise.resolve(null),
        ];

        const [results, allCollections, catalogResult] = await Promise.all(
          requests
        );

        // Cache catalog products
        if (catalogResult && catalogResult.edges) {
          catalogRef.current = catalogResult.edges.map((e) => e.node);
          catalogLoadedRef.current = true;
        }

        // Products
        let searchedProducts: Product[] = [];
        if (results.edges) {
          searchedProducts = results.edges.map((edge) => edge.node);
          setProducts(searchedProducts);
          setPageInfo(results.pageInfo);
        } else {
          setProducts([]);
          setPageInfo({
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: null,
            endCursor: null,
          });
        }

        // Filter collections that match the query
        const queryLower = query.toLowerCase();
        const filtered = allCollections.filter(
          (c) =>
            c.title.toLowerCase().includes(queryLower) ||
            c.handle.toLowerCase().includes(queryLower) ||
            (c.description &&
              c.description.toLowerCase().includes(queryLower))
        );
        setMatchingCollections(filtered);

        // "Você quis dizer?" — only when few/no results
        if (searchedProducts.length <= 2) {
          const dictionary = buildDictionary(
            allCollections,
            searchedProducts,
            catalogRef.current
          );
          const match = findSuggestion(query, dictionary);
          setSuggestion(match);
        }
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        setProducts([]);
        setPageInfo(null);
        setMatchingCollections([]);
        setSuggestion(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full bg-[#f5f5f5] pt-[120px] md:pt-[140px] pb-12 md:pb-16">
        <div className="text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center justify-center gap-2 text-[11px] sm:text-xs tracking-[0.15em] text-[#666]">
              <li>
                <Link
                  href="/"
                  className="hover:text-[#1a1a1a] transition-colors uppercase"
                >
                  Home
                </Link>
              </li>
              <li className="text-[#ccc]">/</li>
              <li className="text-[#1a1a1a] font-medium uppercase">Busca</li>
            </ol>
          </nav>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-[#1a1a1a] tracking-wide mb-6">
            Busca
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-[#666] max-w-2xl mx-auto leading-relaxed font-light mb-8">
            Encontre o que você procura em nosso catálogo de produtos.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSubmit}
            className="max-w-xl mx-auto flex items-center border border-[#d0d0d0] bg-white rounded-sm overflow-hidden"
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome, categoria, coleção..."
              className="flex-1 py-3.5 px-5 text-sm text-[#1a1a1a] placeholder-[#999] bg-transparent focus:outline-none"
            />
            <button
              type="submit"
              className="px-5 py-3.5 text-[#1a1a1a] hover:text-[#666] transition-colors"
              aria-label="Buscar"
            >
              <SearchIcon className="w-5 h-5" />
            </button>
          </form>
        </div>
      </section>

      {/* Results Content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Loading */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block w-8 h-8 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-sm text-[#666]">Buscando produtos...</p>
          </div>
        )}

        {/* Results header */}
        {!loading && query && (
          <div className="mb-10">
            <p className="text-sm text-[#666] tracking-wide">
              {products.length > 0
                ? `${products.length} resultado${products.length !== 1 ? "s" : ""} para`
                : "Nenhum resultado para"}{" "}
              <span className="text-[#1a1a1a] font-medium">
                &ldquo;{query}&rdquo;
              </span>
            </p>

            {/* "Você quis dizer?" suggestion */}
            {suggestion && (
              <p className="mt-2 text-sm text-[#666]">
                Você quis dizer{" "}
                <Link
                  href={`/search?q=${encodeURIComponent(suggestion)}`}
                  className="text-[#1a1a1a] font-medium underline underline-offset-4 decoration-[#ccc] hover:decoration-[#1a1a1a] transition-colors"
                >
                  {suggestion}
                </Link>
                ?
              </p>
            )}
          </div>
        )}

        {/* Matching Collections */}
        {!loading && matchingCollections.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xs uppercase tracking-[0.15em] font-medium text-[#999] mb-4">
              Coleções encontradas
            </h2>
            <div className="flex flex-wrap gap-3">
              {matchingCollections.map((collection) => (
                <Link
                  key={collection.id}
                  href={`/shop/${collection.handle}`}
                  className="group flex items-center gap-2 px-5 py-3 border border-[#e0e0e0] rounded-sm text-sm text-[#1a1a1a] hover:border-[#1a1a1a] transition-colors"
                >
                  {collection.title}
                  <ArrowRight className="w-3.5 h-3.5 text-[#999] group-hover:text-[#1a1a1a] transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Product Grid */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => {
              const colors = extractColors(product);
              const availableForSale =
                product.variants?.edges.some(
                  (edge) => edge?.node?.availableForSale
                ) ?? true;

              const variants =
                product.variants?.edges.map((edge) => ({
                  id: edge.node.id,
                  title: edge.node.title,
                  price: edge.node.price,
                  compareAtPrice: edge.node.compareAtPrice,
                  availableForSale: edge.node.availableForSale ?? true,
                  quantityAvailable: edge.node.quantityAvailable ?? 99,
                  selectedOptions: edge.node.selectedOptions || [],
                })) || [];

              const options =
                product.options?.map((opt) => ({
                  name: opt.name,
                  values: opt.values,
                })) || [];

              const images =
                product.images?.edges.map((edge) => ({
                  transformedSrc: edge.node.transformedSrc,
                })) || [];

              return (
                <ShopProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  handle={product.handle}
                  price={{
                    amount: product.priceRange.minVariantPrice.amount,
                    currencyCode:
                      product.priceRange.minVariantPrice.currencyCode,
                  }}
                  compareAtPrice={
                    product.variants?.edges[0]?.node.compareAtPrice || undefined
                  }
                  image={{
                    transformedSrc:
                      product.images.edges[0]?.node.transformedSrc || "",
                    altText:
                      product.images.edges[0]?.node.altText || product.title,
                  }}
                  images={images}
                  colors={colors}
                  availableForSale={availableForSale}
                  isPreOrder={isPreOrder(product)}
                  variants={variants}
                  options={options}
                />
              );
            })}
          </div>
        )}

        {/* Empty state - with query but no results */}
        {!loading &&
          query &&
          products.length === 0 &&
          matchingCollections.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-[#f5f5f5]">
                <SearchIcon className="w-7 h-7 text-[#999]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-light text-[#1a1a1a] mb-3">
                Nenhum produto encontrado
              </h3>
              <p className="text-sm text-[#666] mb-4 max-w-md mx-auto">
                Tente usar termos mais gerais ou verifique a ortografia da sua
                busca.
              </p>

              {/* Suggestion in empty state too */}
              {suggestion && (
                <p className="text-sm text-[#666] mb-8">
                  Você quis dizer{" "}
                  <Link
                    href={`/search?q=${encodeURIComponent(suggestion)}`}
                    className="text-[#1a1a1a] font-medium underline underline-offset-4 decoration-[#ccc] hover:decoration-[#1a1a1a] transition-colors"
                  >
                    {suggestion}
                  </Link>
                  ?
                </p>
              )}

              <Link
                href="/shop"
                className="inline-block bg-[#1a1a1a] text-white py-3.5 px-10 text-xs tracking-[0.15em] uppercase font-medium hover:bg-black transition-colors"
              >
                Ver todos os produtos
              </Link>
            </div>
          )}

        {/* Empty state - no query */}
        {!loading && !query && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-[#f5f5f5]">
              <SearchIcon className="w-7 h-7 text-[#999]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-light text-[#1a1a1a] mb-3">
              Digite algo para buscar
            </h3>
            <p className="text-sm text-[#666] max-w-md mx-auto">
              Use a barra de busca acima para encontrar produtos por nome,
              categoria, tag ou coleção.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-sm text-[#666]">Carregando busca...</p>
          </div>
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
