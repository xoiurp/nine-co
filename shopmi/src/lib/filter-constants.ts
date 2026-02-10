export interface PriceRangeOption {
  value: string;
  label: string;
}

export const PRICE_RANGES: PriceRangeOption[] = [
  { value: "any", label: "Qualquer Preço" },
  { value: "0-500", label: "Até R$500" },
  { value: "500-1000", label: "R$500 - R$1000" },
  { value: "1000-2000", label: "R$1000 - R$2000" },
  { value: "2000+", label: "Acima de R$2000" },
];

export const PRICE_RANGE_LABELS: Record<string, string> = Object.fromEntries(
  PRICE_RANGES.filter((r) => r.value !== "any").map((r) => [r.value, r.label])
);
