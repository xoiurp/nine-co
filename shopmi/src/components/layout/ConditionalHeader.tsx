"use client";

import { usePathname } from "next/navigation";
import NewHeader from "./NewHeader";

export default function ConditionalHeader() {
  const pathname = usePathname();

  // Não mostrar header em páginas admin
  if (pathname.startsWith("/admin")) {
    return null;
  }

  // Páginas com fundo escuro/hero (header transparente padrão)
  if (pathname === "/" || pathname === "/shop" || pathname.startsWith("/shop/")) {
    return <NewHeader />;
  }

  // Todas as demais páginas usam NewHeader com cores invertidas (fundo claro)
  return <NewHeader invertColors />;
}
