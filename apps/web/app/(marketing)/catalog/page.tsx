import type { Metadata } from "next";
import { createCaller } from "@/lib/trpc/server";
import { CatalogAnimations } from "@/components/catalog/animations";
import { CatalogGrid } from "@/components/catalog/grid";
import { FilterButtons } from "@/components/catalog/filter-buttons";

export const metadata: Metadata = {
  title: "Каталог — Дуб & Сталь",
  description: "Дизайнерская мебель из дерева и металлический декор премиум сегмента. Дуб, орех, латунь, чернёная сталь.",
  openGraph: {
    title: "Каталог — Дуб & Сталь",
    description: "Дизайнерская мебель из дерева и металлический декор премиум сегмента.",
  },
};

type CatalogSearchParams = {
  category?: string;
  status?: string;
  sort?: "price-asc" | "price-desc" | "new";
};

const selectStyle: React.CSSProperties = {
  border: "1px solid var(--line)",
  background: "var(--paper)",
  padding: "10px 14px",
  fontSize: "12px",
  letterSpacing: "0.05em",
  color: "var(--ink)",
  outline: "none",
  cursor: "pointer",
  width: "100%",
  appearance: "none" as const,
  fontFamily: "var(--font-body)",
};

const labelStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  fontSize: "10px",
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: "var(--gold)",
};

const STATUS_LABELS: Record<string, string> = {
  IN_STOCK: "В наличии",
  OUT_OF_STOCK: "Нет в наличии",
  MADE_TO_ORDER: "На заказ",
};

export default async function CatalogPage({ searchParams }: { searchParams: CatalogSearchParams }) {
  const caller = await createCaller();
  const meta = await caller.products.meta();
  const products = await caller.products.list({
    category: searchParams.category,
    status: searchParams.status,
    sort: searchParams.sort,
  });

  return (
    <main style={{ background: "var(--paper)", color: "var(--ink)", minHeight: "100vh" }}>
      <CatalogAnimations />

      {/* ── Catalog hero — pt for fixed nav ── */}
      <div
        className="catalog-hero"
        style={{
          padding: "160px 60px 80px",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div
          className="catalog-hero-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "80px",
            alignItems: "end",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "11px",
                letterSpacing: "0.25em",
                color: "var(--gold)",
                textTransform: "uppercase",
                marginBottom: "20px",
              }}
            >
              Каталог
            </div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(36px, 4vw, 54px)",
                fontWeight: 300,
                lineHeight: 1.1,
                letterSpacing: "-0.01em",
              }}
            >
              Коллекции мебели<br />
              и <em style={{ fontStyle: "italic", color: "var(--gold)" }}>декора</em>
            </h1>
          </div>
          <p
            style={{
              color: "var(--mid)",
              lineHeight: 1.9,
              fontSize: "15px",
              paddingBottom: "4px",
            }}
          >
            Дизайнерская мебель из массива дерева и металлический декор ручной работы.
            Каждый предмет создаётся вручную и поставляется в течение 5–7 дней.
          </p>
        </div>
      </div>

      {/* ── Filter panel ── */}
      <div
        style={{
          padding: "40px 60px",
          borderBottom: "1px solid var(--line)",
          background: "var(--paper)",
        }}
      >
        <form
          method="GET"
          className="catalog-filter-form"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr auto",
            gap: "24px",
            alignItems: "end",
          }}
        >
          <label style={labelStyle}>
            Категория
            <select name="category" defaultValue={searchParams.category ?? ""} style={selectStyle}>
              <option value="">Все категории</option>
              {meta.categories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </label>

          <label style={labelStyle}>
            Статус
            <select name="status" defaultValue={searchParams.status ?? ""} style={selectStyle}>
              <option value="">Все статусы</option>
              {meta.statuses.map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s] ?? s}</option>
              ))}
            </select>
          </label>

          <label style={labelStyle}>
            Сортировка
            <select name="sort" defaultValue={searchParams.sort ?? ""} style={selectStyle}>
              <option value="">По умолчанию</option>
              <option value="price_asc">Цена: по возрастанию</option>
              <option value="price_desc">Цена: по убыванию</option>
              <option value="name_asc">Название: А → Я</option>
            </select>
          </label>

          <FilterButtons />
        </form>
      </div>

      {/* ── Product grid ── */}
      <div className="catalog-grid-wrap" style={{ padding: "80px 60px" }}>
        <CatalogGrid products={products} />
      </div>
    </main>
  );
}
