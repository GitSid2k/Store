"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function CheckoutSuccessPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const items = el.querySelectorAll(".reveal-item");
    gsap.fromTo(
      items,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: "power3.out", delay: 0.2 }
    );
  }, []);

  return (
    <main style={{ background: "var(--paper)", color: "var(--ink)", minHeight: "100vh", paddingTop: "120px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div ref={containerRef} style={{ textAlign: "center", maxWidth: "560px", padding: "0 40px" }}>

        {/* Checkmark */}
        <div
          className="reveal-item"
          style={{
            width: "72px",
            height: "72px",
            border: "1px solid var(--gold)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 40px",
            fontSize: "28px",
            color: "var(--gold)",
          }}
        >
          ✓
        </div>

        {/* Label */}
        <div
          className="reveal-item"
          style={{ fontFamily: "var(--font-display)", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "20px" }}
        >
          Заказ оформлен
        </div>

        {/* Heading */}
        <h1
          className="reveal-item"
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 300, lineHeight: 1.1, letterSpacing: "-0.01em", marginBottom: "28px" }}
        >
          Спасибо за<br /><em style={{ fontStyle: "italic", color: "var(--gold)" }}>покупку</em>
        </h1>

        {/* Description */}
        <p
          className="reveal-item"
          style={{ color: "var(--mid)", lineHeight: 1.9, fontSize: "15px", marginBottom: "48px" }}
        >
          Мы получили ваш заказ и свяжемся с вами в течение 24 часов
          для подтверждения деталей и сроков доставки.
        </p>

        {/* Divider */}
        <div className="reveal-item" style={{ width: "40px", height: "1px", background: "var(--gold)", margin: "0 auto 48px" }} />

        {/* Actions */}
        <div className="reveal-item" style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/catalog"
            style={{
              background: "var(--ink)",
              color: "white",
              padding: "14px 32px",
              fontSize: "11px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              textDecoration: "none",
              fontFamily: "var(--font-body)",
              display: "inline-block",
            }}
          >
            Продолжить покупки
          </Link>
          <Link
            href="/account/orders"
            style={{
              background: "transparent",
              color: "var(--ink)",
              padding: "14px 32px",
              fontSize: "11px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              textDecoration: "none",
              fontFamily: "var(--font-body)",
              border: "1px solid var(--line)",
              display: "inline-block",
            }}
          >
            Мои заказы
          </Link>
        </div>
      </div>
    </main>
  );
}
