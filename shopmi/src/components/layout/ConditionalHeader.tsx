"use client";

import { usePathname } from "next/navigation";
import NewHeader from "./NewHeader";

export default function ConditionalHeader() {
  const pathname = usePathname();

  // Não mostrar header em páginas admin ou checkout (checkout tem header próprio)
  if (pathname.startsWith("/admin") || pathname.startsWith("/checkout")) {
    return null;
  }

  // Header sempre branco com cores originais do logotipo
  return <NewHeader />;
}
