import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createCaller } from "@/lib/trpc/server";
import { ProductInteractive } from "@/components/product/interactive";
import { ProductGallery } from "@/components/product/gallery";
import { HomeSpotlight } from "@/components/home/spotlight";

const STATUS_LABEL: Record<string, string> = {
  IN_STOCK: "В наличии",
  OUT_OF_STOCK: "Нет в наличии",
  MADE_TO_ORDER: "Под заказ",
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const caller = await createCaller();
  const product = await caller.products.bySlug(params.slug);
  if (!product) return { title: "Товар не найден" };
  return {
    title: `${product.title} — Дуб & Сталь`,
    description: product.subtitle,
    openGraph: {
      title: product.title,
      description: product.subtitle,
      images: [{ url: product.image, width: 1200, height: 1500, alt: product.alt }],
    },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const caller = await createCaller();
  const [product, allProducts] = await Promise.all([
    caller.products.bySlug(params.slug),
    caller.products.list(),
  ]);
  if (!product) notFound();

  const related = allProducts.filter((p) => p.slug !== params.slug).slice(0, 4);

  const specs = [
    { key: "Материал", value: "Дуб / сталь" },
    { key: "Доставка", value: "5–7 дней" },
    { key: "Гарантия", value: "2 года" },
    { key: "Статус", value: STATUS_LABEL[product.badge] ?? product.badge },
    ...(product.specs ? (typeof product.specs === "object" && !Array.isArray(product.specs)
      ? Object.entries(product.specs as Record<string, string>).map(([key, value]) => ({ key, value: String(value) }))
      : []) : []),
  ];

  return (
    <main style={{ background: "var(--paper)", color: "var(--ink)", minHeight: "100vh" }}>
      {/* ── Breadcrumb ── */}
      <div className="breadcrumb-bar" style={{ padding: "120px 60px 0", display: "flex", gap: "8px", alignItems: "center", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase" }}>
        <Link href="/catalog" className="hover-gold-link" style={{ color: "var(--mid)", textDecoration: "none" }}>Каталог</Link>
        <span style={{ color: "var(--line)" }}>—</span>
        <span style={{ color: "var(--gold)" }}>{product.title}</span>
      </div>

      {/* ── Product layout ── */}
      <div className="product-layout" style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: "60px", padding: "40px 60px 80px" }}>
        {/* Gallery */}
        <div style={{ position: "sticky", top: "80px", alignSelf: "start" }}>
          <ProductGallery images={product.images.map((img) => ({ url: img.url, alt: img.alt ?? product.alt }))} />
        </div>

        {/* Info panel */}
        <div style={{ paddingTop: "8px" }}>
          {/* Badge */}
          <div style={{
            background: product.badge === "OUT_OF_STOCK" ? "var(--ink)" : "var(--gold-pale)",
            color: product.badge === "OUT_OF_STOCK" ? "white" : "var(--gold)",
            fontSize: "9px", letterSpacing: "0.25em", textTransform: "uppercase",
            padding: "6px 14px", display: "inline-block", marginBottom: "24px",
          }}>
            {STATUS_LABEL[product.badge] ?? product.badge}
          </div>

          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 3vw, 48px)", fontWeight: 300, lineHeight: 1.1, letterSpacing: "-0.01em", color: "var(--ink)", marginBottom: "12px" }}>
            {product.title}
          </h1>

          <p style={{ fontSize: "15px", color: "var(--mid)", lineHeight: 1.8, marginBottom: "28px" }}>
            {product.subtitle}
          </p>

          {/* Rating */}
          {product.ratingAvg != null && product.ratingCount != null && product.ratingCount > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
              <div style={{ display: "flex", gap: "2px" }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} style={{ fontSize: "12px", color: s <= Math.round(product.ratingAvg!) ? "var(--gold)" : "var(--line)" }}>★</span>
                ))}
              </div>
              <span style={{ fontSize: "12px", color: "var(--mid)" }}>
                {product.ratingAvg.toFixed(1)} · {product.ratingCount} {product.ratingCount === 1 ? "отзыв" : product.ratingCount < 5 ? "отзыва" : "отзывов"}
              </span>
            </div>
          )}

          {/* Price */}
          <div style={{ fontFamily: "var(--font-display)", fontSize: "30px", fontWeight: 400, color: "var(--ink)", marginBottom: "32px" }}>
            {product.price}
          </div>

          {/* Interactive: qty + cart + tabs */}
          <ProductInteractive
            badge={product.badge}
            specs={specs}
            slug={product.slug}
            title={product.title}
            price={product.rawPrice}
            image={product.image}
            alt={product.alt}
            description={product.subtitle}
            ratingAvg={product.ratingAvg}
            ratingCount={product.ratingCount}
            reviews={product.reviews}
          />
        </div>
      </div>

      {/* ── JSON-LD ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.title,
            description: product.subtitle,
            image: product.images.map((img) => img.url),
            sku: product.slug,
            brand: { "@type": "Brand", name: "Дуб & Сталь" },
            offers: {
              "@type": "Offer",
              priceCurrency: "RUB",
              price: product.rawPrice,
              availability:
                product.badge === "OUT_OF_STOCK"
                  ? "https://schema.org/OutOfStock"
                  : "https://schema.org/InStock",
              seller: { "@type": "Organization", name: "Дуб & Сталь" },
            },
            ...(product.ratingAvg != null && product.ratingCount != null && product.ratingCount > 0
              ? {
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: product.ratingAvg,
                    reviewCount: product.ratingCount,
                  },
                }
              : {}),
          }),
        }}
      />

      {/* ── Trust badges ── */}
      <div style={{ padding: "48px 60px", borderTop: "1px solid var(--line)", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
        {[
          { label: "Ручная работа", text: "Каждый предмет собирается вручную в мастерской Подмосковья" },
          { label: "Доставка по России", text: "Собственная служба доставки, сборка включена в стоимость" },
          { label: "Гарантия 2 года", text: "Полная гарантия на все изделия плюс поддержка после покупки" },
        ].map((b) => (
          <div key={b.label} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ width: "24px", height: "1px", background: "var(--gold)" }} />
            <div style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink)", marginBottom: "4px" }}>{b.label}</div>
            <p style={{ fontSize: "13px", color: "var(--mid)", lineHeight: 1.7 }}>{b.text}</p>
          </div>
        ))}
      </div>

      {/* ── Related products ── */}
      {related.length > 0 && (
        <div style={{ padding: "80px 60px", borderTop: "1px solid var(--line)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "48px" }}>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "12px" }}>
                Также из коллекции
              </div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 300, lineHeight: 1.1, letterSpacing: "-0.01em" }}>
                Похожие <em style={{ fontStyle: "italic", color: "var(--gold)" }}>товары</em>
              </h2>
            </div>
            <Link href="/catalog" className="hover-gold-link" style={{ fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--mid)", textDecoration: "none" }}>
              Весь каталог →
            </Link>
          </div>
          <HomeSpotlight products={related} />
        </div>
      )}
    </main>
  );
}
