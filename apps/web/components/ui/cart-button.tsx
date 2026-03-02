"use client";

import Link from "next/link";
import { useCart } from "@/store/cart";

export function CartButton() {
  const count = useCart((s) => s.count());
  return (
    <Link
      href={"/cart" as never}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        fontSize: "11px",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "var(--mid)",
        textDecoration: "none",
        transition: "color 0.2s",
      }}
      className="hover-gold-link"
    >
      Корзина
      {count > 0 && (
        <span
          style={{
            background: "var(--gold)",
            color: "white",
            fontSize: "9px",
            fontWeight: 500,
            borderRadius: "50%",
            width: "18px",
            height: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
