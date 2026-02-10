"use client";

import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { X } from "lucide-react";
import { PRICE_RANGE_LABELS } from "@/lib/filter-constants";

interface ActiveFilterChipsProps {
  currentCategoryHandle?: string;
}

const ActiveFilterChips: React.FC<ActiveFilterChipsProps> = ({
  currentCategoryHandle,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const activeTags = searchParams.getAll("tag");
  const activePriceRange = searchParams.get("priceRange");
  const hasFilters =
    activeTags.length > 0 ||
    (activePriceRange && activePriceRange !== "any");

  if (!hasFilters) return null;

  const buildUrl = (params: URLSearchParams) => {
    const path = currentCategoryHandle
      ? `/shop/${currentCategoryHandle}`
      : "/shop";
    const qs = params.toString();
    return qs ? `${path}?${qs}` : path;
  };

  const removeFilter = (filterType: string, value?: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    if (filterType === "tag" && value) {
      const existing = current.getAll("tag");
      current.delete("tag");
      existing
        .filter((t) => t !== value)
        .forEach((t) => current.append("tag", t));
    } else if (filterType === "priceRange") {
      current.delete("priceRange");
    }

    current.delete("after");
    current.delete("before");

    router.push(buildUrl(current), { scroll: false });
    router.refresh();
  };

  const clearAll = () => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.delete("tag");
    current.delete("priceRange");
    current.delete("after");
    current.delete("before");

    router.push(buildUrl(current), { scroll: false });
    router.refresh();
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {activePriceRange && activePriceRange !== "any" && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f5f5f5] text-xs text-[#1a1a1a] border border-[#e0e0e0]">
          {PRICE_RANGE_LABELS[activePriceRange] || activePriceRange}
          <button
            onClick={() => removeFilter("priceRange")}
            className="text-[#999] hover:text-[#1a1a1a] transition-colors"
          >
            <X size={12} />
          </button>
        </span>
      )}
      {activeTags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f5f5f5] text-xs text-[#1a1a1a] border border-[#e0e0e0]"
        >
          {tag}
          <button
            onClick={() => removeFilter("tag", tag)}
            className="text-[#999] hover:text-[#1a1a1a] transition-colors"
          >
            <X size={12} />
          </button>
        </span>
      ))}
      <button
        onClick={clearAll}
        className="text-xs text-[#666] hover:text-[#1a1a1a] underline transition-colors ml-1"
      >
        Limpar tudo
      </button>
    </div>
  );
};

export default ActiveFilterChips;
