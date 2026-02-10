"use client";

import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const sortOptions = [
  { value: "featured", label: "Em destaque" },
  { value: "best-selling", label: "Mais vendidos" },
  { value: "price-asc", label: "Preço: menor para maior" },
  { value: "price-desc", label: "Preço: maior para menor" },
  { value: "name-asc", label: "Nome: A-Z" },
  { value: "name-desc", label: "Nome: Z-A" },
  { value: "created-desc", label: "Novidades" },
  { value: "created-asc", label: "Mais antigos" },
];

interface ShopSortSelectProps {
  initialSortValue?: string;
}

const ShopSortSelect: React.FC<ShopSortSelectProps> = ({ initialSortValue }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentSort = initialSortValue || "best-selling";

  const handleSortChange = (value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    if (value === "featured") {
      current.delete("sort");
    } else {
      current.set("sort", value);
    }
    
    // Reset pagination
    current.delete("after");
    current.delete("before");

    const newUrl = `${pathname}?${current.toString()}`;
    router.push(newUrl, { scroll: false });
    router.refresh();
  };

  return (
    <Select value={currentSort} onValueChange={handleSortChange}>
      <SelectTrigger className="w-full md:w-[180px] h-10 text-xs border-[#e0e0e0] rounded-none bg-white hover:border-[#999] transition-colors focus:ring-0 focus:ring-offset-0">
        <SelectValue placeholder="Ordenar por" />
      </SelectTrigger>
      <SelectContent className="rounded-none border-[#e0e0e0]">
        {sortOptions.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="text-xs cursor-pointer focus:bg-[#f5f5f5] focus:text-[#1a1a1a]"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ShopSortSelect;
