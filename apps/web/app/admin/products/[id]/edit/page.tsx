"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const inputStyle: React.CSSProperties = {
  border: "1px solid rgba(216,210,196,0.2)",
  background: "rgba(255,255,255,0.05)",
  padding: "10px 14px",
  fontSize: "14px",
  color: "#FAFAF7",
  outline: "none",
  fontFamily: "var(--font-body)",
  width: "100%",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  fontSize: "10px",
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: "rgba(154,122,58,0.9)",
};

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", description: "", price: "", status: "IN_STOCK", imageUrl: "", specs: "" });

  useEffect(() => {
    fetch(`/api/admin/products/${params.id}`)
      .then((r) => r.json())
      .then((p) => {
        setForm({
          name: p.name ?? "",
          description: p.description ?? "",
          price: String(p.price ?? ""),
          status: p.status ?? "IN_STOCK",
          imageUrl: p.images?.[0]?.url ?? "",
          specs: p.specs ? JSON.stringify(JSON.parse(p.specs), null, 2) : "",
        });
        setLoading(false);
      });
  }, [params.id]);

  function set(k: keyof typeof form, v: string) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch(`/api/admin/products/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, price: parseInt(form.price), specs: form.specs ? JSON.parse(form.specs) : {} }),
      });
      router.push("/admin/products" as never);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div style={{ color: "rgba(138,128,112,0.5)" }}>Загрузка...</div>;

  return (
    <div style={{ maxWidth: "720px" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 300, color: "#FAFAF7", marginBottom: "32px" }}>
        Редактировать товар
      </h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <label style={labelStyle}>
          Название
          <input value={form.name} onChange={(e) => set("name", e.target.value)} style={inputStyle} />
        </label>
        <label style={labelStyle}>
          Описание
          <textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} style={{ ...inputStyle, resize: "vertical" }} />
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <label style={labelStyle}>
            Цена (₽)
            <input type="number" value={form.price} onChange={(e) => set("price", e.target.value)} style={inputStyle} />
          </label>
          <label style={labelStyle}>
            Статус
            <select value={form.status} onChange={(e) => set("status", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
              <option value="IN_STOCK">В наличии</option>
              <option value="MADE_TO_ORDER">Под заказ</option>
              <option value="OUT_OF_STOCK">Нет в наличии</option>
            </select>
          </label>
        </div>
        <label style={labelStyle}>
          URL фото
          <input value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} style={inputStyle} />
        </label>
        {form.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={form.imageUrl} alt="preview" style={{ maxHeight: "160px", objectFit: "cover", border: "1px solid rgba(216,210,196,0.15)" }} />
        )}
        <label style={labelStyle}>
          Спецификации (JSON)
          <textarea rows={4} value={form.specs} onChange={(e) => set("specs", e.target.value)} style={{ ...inputStyle, resize: "vertical", fontFamily: "monospace", fontSize: "12px" }} />
        </label>
        <div style={{ display: "flex", gap: "16px", paddingTop: "8px" }}>
          <button type="submit" disabled={saving} style={{ background: "#9A7A3A", color: "white", padding: "12px 28px", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "var(--font-body)", border: "none", cursor: "pointer" }}>
            {saving ? "Сохраняем..." : "Сохранить"}
          </button>
          <button type="button" onClick={() => router.back()} style={{ background: "transparent", color: "rgba(138,128,112,0.7)", padding: "12px 20px", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", border: "1px solid rgba(216,210,196,0.2)", cursor: "pointer", fontFamily: "var(--font-body)" }}>
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}
