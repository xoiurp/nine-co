"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import NewHeader from "./NewHeader";

export default function ConditionalHeader() {
  const pathname = usePathname();

  // Não mostrar header em páginas admin
  if (pathname.startsWith("/admin")) {
    return null;
  }

  // Usar o novo header na página inicial
  if (pathname === "/") {
    return <NewHeader />;
  }

  // Usar o header antigo nas outras páginas
  return <Header />;
}
