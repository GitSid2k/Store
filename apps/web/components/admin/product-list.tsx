"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/products";

const STATUS_COLORS: Record<string, string> = {
  IN_STOCK: "#4ade80",
  OUT_OF_STOCK: "#f87171",
  MADE_TO_ORDER: "#fbbf24",
};

const STATUS_LABELS: Record<string, string> = {
  IN_STOCK: "В наличии",
  OUT_OF_STOCK: "Нет в наличии",
  MADE_TO_ORDER: "На заказ",
};

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  status: string;
  category: { name: string };
  images: { url: string }[];
};

export function AdminProductList({ initialProducts }: { initialProducts: Product[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = initialProducts.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.slug.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter ? p.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
        <input
          type="text"
          placeholder="Поиск по названию или slug..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, padding: "10px 14px", border: "1px solid rgba(216,210,196,0.2)", background: "rgba(255,255,255,0.05)", color: "#FAFAF7", outline: "none", fontSize: "14px", fontFamily: "var(--font-body)" }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ width: "200px", padding: "10px 14px", border: "1px solid rgba(216,210,196,0.2)", background: "rgba(255,255,255,0.05)", color: "#FAFAF7", outline: "none", fontSize: "14px", fontFamily: "var(--font-body)", cursor: "pointer" }}
        >
          <option value="">Все статусы</option>
          <option value="IN_STOCK">В наличии</option>
          <option value="MADE_TO_ORDER">На заказ</option>
          <option value="OUT_OF_STOCK">Нет в наличии</option>
        </select>
      </div>

      <div style={{ border: "1px solid rgba(216,210,196,0.15)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(216,210,196,0.15)", background: "rgba(255,255,255,0.03)" }}>
              {["Фото", "Название", "Категория", "Цена", "Статус", "Действия"].map((h) => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(138,128,112,0.7)", fontWeight: 400 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: "32px", textAlign: "center", color: "rgba(138,128,112,0.5)", fontSize: "14px" }}>
                  Ничего не найдено
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} style={{ borderBottom: "1px solid rgba(216,210,196,0.08)" }}>
                  <td style={{ padding: "12px 16px" }}>
                    {p.images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.images[0].url} alt={p.name} style={{ width: "48px", height: "48px", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "48px", height: "48px", background: "rgba(255,255,255,0.05)" }} />
                    )}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ fontSize: "14px", color: "#FAFAF7", marginBottom: "2px" }}>{p.name}</div>
                    <div style={{ fontSize: "11px", color: "rgba(138,128,112,0.7)" }}>{p.slug}</div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "rgba(138,128,112,0.7)" }}>{p.category.name}</td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "#FAFAF7", fontFamily: "var(--font-display)" }}>{formatPrice(p.price)}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: STATUS_COLORS[p.status] ?? "#FAFAF7" }}>
                      {STATUS_LABELS[p.status] ?? p.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <Link href={`/admin/products/${p.id}/edit` as never} style={{ fontSize: "11px", color: "#9A7A3A", textDecoration: "none", letterSpacing: "0.1em", textTransform: "uppercase" }}>Изменить</Link>
                      <form action={`/api/admin/products/${p.id}` as never} method="DELETE" style={{ display: "inline" }}>
                        <button type="submit" style={{ fontSize: "11px", color: "rgba(248,113,113,0.7)", background: "none", border: "none", cursor: "pointer", letterSpacing: "0.1em", textTransform: "uppercase", padding: 0 }}>Удалить</button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
