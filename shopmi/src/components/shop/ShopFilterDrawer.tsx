"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Collection } from "@/lib/shopify";
import { PRICE_RANGES } from "@/lib/filter-constants";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/Sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { SlidersHorizontal } from "lucide-react";

interface ShopFilterDrawerProps {
  collections: Collection[];
  currentCategoryHandle?: string;
  currentPriceRange?: string;
  categoryTags?: string[];
  totalProducts: number;
}

const ShopFilterDrawer: React.FC<ShopFilterDrawerProps> = ({
  collections,
  currentCategoryHandle,
  currentPriceRange,
  categoryTags,
  totalProducts,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);

  // Batch mode: local pending state
  const [pendingTags, setPendingTags] = useState<string[]>([]);
  const [pendingPriceRange, setPendingPriceRange] = useState<string>("any");

  const tagsList = categoryTags || [];

  // Active filter count from URL (for badge on trigger button)
  const activeTagCount = searchParams.getAll("tag").length;
  const activePriceActive =
    searchParams.get("priceRange") &&
    searchParams.get("priceRange") !== "any"
      ? 1
      : 0;
  const activeFilterCount = activeTagCount + activePriceActive;

  // Pending filter count (inside drawer)
  const pendingFilterCount =
    pendingTags.length + (pendingPriceRange !== "any" ? 1 : 0);

  // Sync pending state from URL when drawer opens
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setPendingTags(searchParams.getAll("tag"));
      setPendingPriceRange(searchParams.get("priceRange") || "any");
      setShowAllTags(false);
    }
    setIsOpen(open);
  };

  // Local state mutators (no router.push)
  const handleTagToggle = (tag: string, checked: boolean) => {
    setPendingTags((prev) =>
      checked ? [...prev, tag] : prev.filter((t) => t !== tag)
    );
  };

  const handlePriceChange = (value: string) => {
    setPendingPriceRange(value);
  };

  const handleClearPending = () => {
    setPendingTags([]);
    setPendingPriceRange("any");
  };

  // Single router.push when user clicks "Aplicar filtros"
  const handleApplyFilters = () => {
    const current = new URLSearchParams();

    // Preserve sort param
    const sortVal = searchParams.get("sort");
    if (sortVal) current.set("sort", sortVal);

    // Set price
    if (pendingPriceRange && pendingPriceRange !== "any") {
      current.set("priceRange", pendingPriceRange);
    }

    // Set tags
    pendingTags.forEach((tag) => current.append("tag", tag));

    const path = currentCategoryHandle
      ? `/shop/${currentCategoryHandle}`
      : "/shop";
    const qs = current.toString();
    router.push(qs ? `${path}?${qs}` : path, { scroll: false });
    router.refresh();
    setIsOpen(false);
  };

  // Tags to display (with show more/less)
  const MAX_VISIBLE_TAGS = 8;
  const displayedTags = showAllTags
    ? tagsList
    : tagsList.slice(0, MAX_VISIBLE_TAGS);

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-[#e0e0e0] bg-white text-sm text-[#1a1a1a] hover:border-[#999] transition-colors">
          <SlidersHorizontal size={16} />
          <span>Filtros</span>
          {activeFilterCount > 0 && (
            <Badge className="ml-0.5 h-5 min-w-5 rounded-full px-1.5 py-0 flex items-center justify-center text-[10px] bg-[#1a1a1a] text-white border-none">
              {activeFilterCount}
            </Badge>
          )}
        </button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-[85vw] sm:w-[420px] p-0 bg-white border-r border-[#e0e0e0] flex flex-col"
      >
        {/* Header */}
        <SheetHeader className="p-6 pb-4 border-b border-[#e0e0e0]">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-normal text-[#1a1a1a]">
              Filtros
            </SheetTitle>
            {pendingFilterCount > 0 && (
              <button
                onClick={handleClearPending}
                className="text-xs text-[#666] hover:text-[#1a1a1a] transition-colors underline"
              >
                Limpar tudo
              </button>
            )}
          </div>
        </SheetHeader>

        {/* Filter Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6">
          <Accordion
            type="multiple"
            defaultValue={["categories", "price", "tags"]}
            className="w-full"
          >
            {/* Categories */}
            <AccordionItem
              value="categories"
              className="border-b border-[#e0e0e0]"
            >
              <AccordionTrigger className="text-sm font-medium text-[#1a1a1a] hover:no-underline py-4">
                Categorias
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-1">
                  {collections.map((collection) => (
                    <li key={collection.id}>
                      <Link
                        href={`/shop/${collection.handle}`}
                        onClick={() => setIsOpen(false)}
                        className={`block py-2 text-sm transition-colors ${
                          collection.handle === currentCategoryHandle
                            ? "text-[#1a1a1a] font-medium"
                            : "text-[#666] hover:text-[#1a1a1a]"
                        }`}
                      >
                        {collection.title}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href="/shop"
                      onClick={() => setIsOpen(false)}
                      className={`block py-2 text-sm transition-colors ${
                        !currentCategoryHandle
                          ? "text-[#1a1a1a] font-medium"
                          : "text-[#666] hover:text-[#1a1a1a]"
                      }`}
                    >
                      Ver Tudo
                    </Link>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* Price */}
            <AccordionItem
              value="price"
              className="border-b border-[#e0e0e0]"
            >
              <AccordionTrigger className="text-sm font-medium text-[#1a1a1a] hover:no-underline py-4">
                Preço
              </AccordionTrigger>
              <AccordionContent>
                <RadioGroup
                  value={pendingPriceRange}
                  onValueChange={handlePriceChange}
                  className="space-y-1"
                >
                  {PRICE_RANGES.map((range) => (
                    <div
                      key={range.value}
                      className="flex items-center space-x-3 py-1"
                    >
                      <RadioGroupItem
                        value={range.value}
                        id={`price-${range.value}`}
                        className="border-[#ccc] data-[state=checked]:border-[#1a1a1a] data-[state=checked]:bg-[#1a1a1a] data-[state=checked]:text-white"
                      />
                      <Label
                        htmlFor={`price-${range.value}`}
                        className={`text-sm font-normal cursor-pointer transition-colors ${
                          pendingPriceRange === range.value
                            ? "text-[#1a1a1a] font-medium"
                            : "text-[#666] hover:text-[#1a1a1a]"
                        }`}
                      >
                        {range.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </AccordionContent>
            </AccordionItem>

            {/* Tags */}
            {tagsList.length > 0 && (
              <AccordionItem value="tags" className="border-b-0">
                <AccordionTrigger className="text-sm font-medium text-[#1a1a1a] hover:no-underline py-4">
                  Tags
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-1">
                    {displayedTags.map((tag) => (
                      <div
                        key={tag}
                        className="flex items-center space-x-3 py-1"
                      >
                        <Checkbox
                          id={`tag-${tag}`}
                          checked={pendingTags.includes(tag)}
                          onCheckedChange={(checked) =>
                            handleTagToggle(tag, !!checked)
                          }
                          className="border-[#ccc] data-[state=checked]:bg-[#1a1a1a] data-[state=checked]:border-[#1a1a1a]"
                        />
                        <Label
                          htmlFor={`tag-${tag}`}
                          className={`text-sm font-normal cursor-pointer transition-colors ${
                            pendingTags.includes(tag)
                              ? "text-[#1a1a1a] font-medium"
                              : "text-[#666] hover:text-[#1a1a1a]"
                          }`}
                        >
                          {tag}
                        </Label>
                      </div>
                    ))}
                    {tagsList.length > MAX_VISIBLE_TAGS && (
                      <button
                        onClick={() => setShowAllTags(!showAllTags)}
                        className="text-xs text-[#666] hover:text-[#1a1a1a] mt-2 transition-colors"
                      >
                        {showAllTags
                          ? "Mostrar menos"
                          : `Mostrar mais (${tagsList.length - MAX_VISIBLE_TAGS})`}
                      </button>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#e0e0e0] space-y-3">
          <button
            onClick={handleApplyFilters}
            className="w-full py-3.5 text-xs uppercase tracking-[0.15em] font-medium bg-[#1a1a1a] text-white hover:bg-black transition-colors"
          >
            Aplicar filtros
            {pendingFilterCount > 0 && ` (${pendingFilterCount})`}
          </button>
          <button
            onClick={handleClearPending}
            disabled={pendingFilterCount === 0}
            className={`w-full py-3.5 text-xs uppercase tracking-[0.15em] font-medium border transition-colors ${
              pendingFilterCount > 0
                ? "border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#f5f5f5]"
                : "border-[#e0e0e0] text-[#999] cursor-not-allowed"
            }`}
          >
            Limpar filtros
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ShopFilterDrawer;
