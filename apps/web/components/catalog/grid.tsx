"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { WishlistButton } from "@/components/ui/wishlist-button";

export type CatalogProduct = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  price: string;
  badge: string;
  image: string;
  alt: string;
  ratingAvg?: number | null;
  ratingCount?: number | null;
  specs?: string | null;
};

type Props = {
  products: CatalogProduct[];
};

const STATUS_LABEL: Record<string, string> = {
  IN_STOCK: "В наличии",
  OUT_OF_STOCK: "Нет в наличии",
  MADE_TO_ORDER: "Под заказ",
};

/* Badge style from design plan */
function ProductBadge({ badge }: { badge: string }) {
  const label = STATUS_LABEL[badge] ?? badge;
  const isSale = label.startsWith("−") || label.startsWith("-") || label.includes("%");
  return (
    <div
      style={{
        background: isSale ? "var(--ink)" : "var(--gold-pale)",
        color: isSale ? "white" : "var(--gold)",
        fontSize: "9px",
        letterSpacing: "0.25em",
        textTransform: "uppercase",
        padding: "6px 14px",
        display: "inline-block",
        fontFamily: "var(--font-body)",
        fontWeight: 400,
      }}
    >
      {label}
    </div>
  );
}

export function CatalogGrid({ products }: Props) {
  useMemo(() => products, [products]);

  /* Empty / no-results state */
  if (products.length === 0) {
    return (
      <div
        style={{
          padding: "120px 0",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
        }}
        data-testid="catalog-empty"
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "11px",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "var(--gold)",
          }}
        >
          Поиск
        </div>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(28px, 3vw, 40px)",
            fontWeight: 300,
            color: "var(--ink)",
            lineHeight: 1.2,
          }}
        >
          Ничего не найдено
        </h3>
        <p style={{ fontSize: "15px", color: "var(--mid)", maxWidth: "380px", lineHeight: 1.8 }}>
          Попробуйте сбросить фильтры — может, нужный предмет ещё ждёт вас.
        </p>
        <a
          href="/catalog"
          style={{
            marginTop: "8px",
            fontSize: "11px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--gold)",
            textDecoration: "none",
            borderBottom: "1px solid var(--gold)",
            paddingBottom: "2px",
          }}
        >
          Сбросить фильтры
        </a>
      </div>
    );
  }

  return (
    <>
      {/* ── Grid ── */}
      <div
        className="product-grid"
        data-testid="catalog-grid"
      >
        {products.map((item) => (
          <article
            key={item.slug}
            data-testid="product-card"
            style={{
              border: "1px solid var(--line)",
              background: "white",
              display: "flex",
              flexDirection: "column",
              cursor: "pointer",
              transition: "all 0.35s ease",
              position: "relative",
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
            {/* Image */}
            <div
              style={{
                position: "relative",
                aspectRatio: "3/4",
                overflow: "hidden",
                background: "var(--warm-gray)",
              }}
            >
              <Image
                src={item.image}
                alt={item.alt}
                fill
                style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
                sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, 50vw"
                priority
                onMouseEnter={(e) => { (e.target as HTMLImageElement).style.transform = "scale(1.03)"; }}
                onMouseLeave={(e) => { (e.target as HTMLImageElement).style.transform = "scale(1)"; }}
              />
              {/* Badge overlay */}
              <div style={{ position: "absolute", top: "16px", left: "16px" }}>
                <ProductBadge badge={item.badge} />
              </div>
              <div style={{ position: "absolute", top: "12px", right: "12px", zIndex: 2 }}>
                <WishlistButton item={{ id: item.id, slug: item.slug, title: item.title, price: item.price, image: item.image, alt: item.alt }} size="sm" />
              </div>
            </div>

            {/* Info */}
            <div style={{ padding: "20px 24px", flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
              <p
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--mid)",
                }}
              >
                {item.subtitle}
              </p>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "22px",
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                  color: "var(--ink)",
                  lineHeight: 1.2,
                }}
              >
                {item.title}
              </h3>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "20px",
                  fontWeight: 400,
                  color: "var(--ink)",
                  marginTop: "4px",
                }}
              >
                {item.price}
              </div>
              {item.ratingAvg ? (
                <p style={{ fontSize: "12px", color: "var(--mid)" }}>
                  ★ {Number(item.ratingAvg).toFixed(1)} ({item.ratingCount ?? 0})
                </p>
              ) : null}
            </div>

            {/* Link overlay */}
            <Link
              href={`/product/${item.slug}`}
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 1,
              }}
              aria-label={`Открыть ${item.title}`}
            />
          </article>
        ))}
      </div>

    </>
  );
}
