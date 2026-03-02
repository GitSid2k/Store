import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createCaller } from "@/lib/trpc/server";
import { CatalogGrid } from "@/components/catalog/grid";
import Link from "next/link";

const COLLECTIONS: Record<string, { name: string; description: string; image: string }> = {
  living: {
    name: "Гостиная",
    description: "Мебель для гостиной — диваны, консоли и журнальные столики из массива дуба и металла.",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1600&q=80",
  },
  dining: {
    name: "Столовая",
    description: "Обеденные столы и стулья для семейных ужинов и дружеских застолий.",
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=1600&q=80",
  },
  bedroom: {
    name: "Спальня",
    description: "Кровати и прикроватные тумбы — создайте пространство для спокойного отдыха.",
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1600&q=80",
  },
  lighting: {
    name: "Освещение",
    description: "Светильники из металла ручной работы — от минимализма до арт-деко.",
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1600&q=80",
  },
  storage: {
    name: "Хранение",
    description: "Полки, стеллажи и аксессуары для организации пространства.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1600&q=80",
  },
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const col = COLLECTIONS[params.slug];
  if (!col) return { title: "Коллекция не найдена" };
  return {
    title: `${col.name} — Дуб & Сталь`,
    description: col.description,
    openGraph: {
      title: col.name,
      description: col.description,
      images: [{ url: col.image, width: 1600, height: 900, alt: col.name }],
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(COLLECTIONS).map((slug) => ({ slug }));
}

export default async function CollectionPage({ params }: { params: { slug: string } }) {
  const collection = COLLECTIONS[params.slug];
  if (!collection) notFound();

  const caller = await createCaller();
  const products = await caller.products.list({ category: params.slug });

  return (
    <main style={{ background: "var(--paper)", color: "var(--ink)", minHeight: "100vh" }}>
      {/* Hero */}
      <div
        className="collection-hero"
        style={{
          position: "relative",
          height: "60vh",
          minHeight: "420px",
          overflow: "hidden",
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={collection.image}
          alt={collection.name}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,14,12,0.75) 0%, rgba(15,14,12,0.1) 60%)" }} />
        <div className="collection-hero-content" style={{ position: "relative", zIndex: 1, padding: "60px" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "16px" }}>
            Коллекция
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 5vw, 72px)", fontWeight: 300, color: "white", lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: "16px" }}>
            {collection.name}
          </h1>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.7)", maxWidth: "480px", lineHeight: 1.8 }}>
            {collection.description}
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="breadcrumb-bar" style={{ padding: "32px 60px 0", display: "flex", gap: "8px", alignItems: "center", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase" }}>
        <Link href="/collections" className="hover-gold-link" style={{ color: "var(--mid)", textDecoration: "none" }}>Коллекции</Link>
        <span style={{ color: "var(--line)" }}>—</span>
        <span style={{ color: "var(--gold)" }}>{collection.name}</span>
      </div>

      {/* Products */}
      <div className="collection-grid" style={{ padding: "60px" }}>
        <CatalogGrid products={products} />
      </div>
    </main>
  );
}
