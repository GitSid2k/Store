"use client";

import Link from "next/link";
import { useCart } from "@/store/cart";
import { useEffect, useState } from "react";

export function CartButton() {
  const count = useCart((s) => s.count());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayCount = mounted ? count : 0;

  return (
    <Link
      href={"/cart" as never}
      aria-label="Открыть корзину"
      style={{
        position: "relative",
        color: "var(--mid)",
        textDecoration: "none",
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      <svg
        width="26"
        height="26"
        viewBox="0 0 26 26"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transition: "color 0.2s" }}
        className="hover-gold-link"
      >
        <path d="M8 9.5v-1.2c0-2.4 1.7-4.3 4-4.3s4 1.9 4 4.3v1.2" />
        <path d="M4.5 9.5h17l-1.1 11.2c-.1 1.3-1.2 2.3-2.5 2.3H8.1c-1.3 0-2.4-1-2.5-2.3L4.5 9.5Z" />
      </svg>
      <span
        style={{
          position: "absolute",
          top: "-4px",
          right: "-4px",
          background: "var(--gold)",
          color: "white",
          fontSize: "9px",
          fontWeight: 600,
          borderRadius: "999px",
          minWidth: "18px",
          height: "18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 4px",
          lineHeight: 1,
          opacity: displayCount > 0 ? 1 : 0,
          transition: "opacity 0.2s",
        }}
        aria-hidden={displayCount === 0}
      >
        {displayCount > 9 ? "9+" : displayCount}
      </span>
    </Link>
  );
}
