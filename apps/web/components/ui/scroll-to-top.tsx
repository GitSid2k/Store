"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const initialRender = useRef(true);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Наверх"
      style={{
        position: "fixed",
        bottom: "32px",
        right: "32px",
        zIndex: 800,
        width: "44px",
        height: "44px",
        background: "var(--ink)",
        color: "white",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "18px",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s, background 0.2s",
        boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "var(--gold)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "var(--ink)"; }}
    >
      ↑
    </button>
  );
}
