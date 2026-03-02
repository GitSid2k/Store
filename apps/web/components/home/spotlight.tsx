"use client";

import Link from "next/link";
import Image from "next/image";
import { WishlistButton } from "@/components/ui/wishlist-button";

export type SpotlightProduct = {
  slug: string;
  title: string;
  subtitle: string;
  price: string;
  badge: string;
  image: string;
  alt: string;
};

const STATUS_BADGE: Record<string, string> = {
  IN_STOCK: "В наличии",
  OUT_OF_STOCK: "Нет в наличии",
  MADE_TO_ORDER: "Под заказ",
};

export function HomeSpotlight({ products }: { products: SpotlightProduct[] }) {
  return (
    <div
      className="spotlight-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "24px",
      }}
    >
      {products.map((item, i) => (
        <article
          key={item.slug}
          style={{
            border: "1px solid var(--line)",
            background: "white",
            display: "flex",
            flexDirection: "column",
            cursor: "pointer",
            transition: "all 0.35s ease",
            position: "relative",
            opacity: 0,
            animation: `fadeSlideUp 0.8s ease-out ${i * 0.1 + 0.2}s both`,
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.borderColor = "var(--gold)";
            el.style.boxShadow = "0 16px 48px rgba(0,0,0,0.08)";
            el.style.transform = "translateY(-4px)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.borderColor = "var(--line)";
            el.style.boxShadow = "none";
            el.style.transform = "translateY(0)";
          }}
        >
          <div style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden", background: "var(--warm-gray)" }}>
            <Image
              src={item.image}
              alt={item.alt}
              fill
              style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
              sizes="(min-width: 1280px) 25vw, 50vw"
              onMouseEnter={(e) => { (e.target as HTMLImageElement).style.transform = "scale(1.04)"; }}
              onMouseLeave={(e) => { (e.target as HTMLImageElement).style.transform = "scale(1)"; }}
            />
            <div style={{
              position: "absolute", top: "16px", left: "16px",
              background: item.badge === "OUT_OF_STOCK" ? "var(--ink)" : "var(--gold-pale)",
              color: item.badge === "OUT_OF_STOCK" ? "white" : "var(--gold)",
              fontSize: "9px", letterSpacing: "0.25em", textTransform: "uppercase",
              padding: "6px 14px", display: "inline-block",
            }}>
              {STATUS_BADGE[item.badge] ?? item.badge}
            </div>
            <div style={{ position: "absolute", top: "12px", right: "12px", zIndex: 2 }}>
              <WishlistButton item={{ slug: item.slug, title: item.title, price: item.price, image: item.image, alt: item.alt }} size="sm" />
            </div>
          </div>

          <div style={{ padding: "24px", flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--mid)" }}>
              {item.subtitle}
            </p>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 500, letterSpacing: "0.02em", color: "var(--ink)", lineHeight: 1.2 }}>
              {item.title}
            </h3>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 400, color: "var(--ink)", marginTop: "4px" }}>
              {item.price}
            </div>
          </div>

          <Link
            href={`/product/${item.slug}` as never}
            style={{ position: "absolute", inset: 0, zIndex: 1 }}
            aria-label={`Открыть ${item.title}`}
          />
        </article>
      ))}
    </div>
  );
}
