"use client";

import { useState, useEffect } from "react";
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

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<{ slug: string; name: string }[]>([]);
  const [form, setForm] = useState({
    name: "", slug: "", description: "", price: "", status: "IN_STOCK",
    category: "", imageUrl: "", specs: "",
  });

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((data) => {
        setCategories(data);
        if (data.length > 0) setForm((p) => ({ ...p, category: data[0].slug }));
      })
      .catch(() => {});
  }, []);

  function set(k: keyof typeof form, v: string) {
    setForm((p) => ({ ...p, [k]: v }));
    if (k === "name" && !form.slug) {
      setForm((p) => ({ ...p, slug: v.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""), [k]: v }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseInt(form.price),
          specs: form.specs ? JSON.parse(form.specs) : {},
        }),
      });
      if (res.ok) router.push("/admin/products" as never);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ maxWidth: "720px" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 300, color: "#FAFAF7", marginBottom: "32px" }}>
        Новый товар
      </h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <label style={labelStyle}>
            Название *
            <input required value={form.name} onChange={(e) => set("name", e.target.value)} style={inputStyle} placeholder="Комод Ridge" />
          </label>
          <label style={labelStyle}>
            Slug *
            <input required value={form.slug} onChange={(e) => set("slug", e.target.value)} style={inputStyle} placeholder="ridge-dresser" />
          </label>
        </div>
        <label style={labelStyle}>
          Описание
          <textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} style={{ ...inputStyle, resize: "vertical" }} placeholder="Краткое описание материала и исполнения" />
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
          <label style={labelStyle}>
            Цена (₽) *
            <input required type="number" value={form.price} onChange={(e) => set("price", e.target.value)} style={inputStyle} placeholder="125000" />
          </label>
          <label style={labelStyle}>
            Статус
            <select value={form.status} onChange={(e) => set("status", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
              <option value="IN_STOCK">В наличии</option>
              <option value="MADE_TO_ORDER">Под заказ</option>
              <option value="OUT_OF_STOCK">Нет в наличии</option>
            </select>
          </label>
          <label style={labelStyle}>
            Категория *
            <select required value={form.category} onChange={(e) => set("category", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
              <option value="">Выберите категорию</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </label>
        </div>
        <label style={labelStyle}>
          URL фото *
          <input required value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} style={inputStyle} placeholder="https://images.unsplash.com/..." />
        </label>
        {form.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={form.imageUrl} alt="preview" style={{ maxHeight: "200px", objectFit: "cover", border: "1px solid rgba(216,210,196,0.15)" }} />
        )}
        <label style={labelStyle}>
          Спецификации (JSON)
          <textarea rows={3} value={form.specs} onChange={(e) => set("specs", e.target.value)} style={{ ...inputStyle, resize: "vertical", fontFamily: "monospace", fontSize: "12px" }} placeholder='{"material": "Дуб", "finish": "Масло"}' />
        </label>
        <div style={{ display: "flex", gap: "16px", paddingTop: "8px" }}>
          <button type="submit" disabled={saving} style={{ background: "#9A7A3A", color: "white", padding: "12px 28px", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "var(--font-body)", border: "none", cursor: "pointer", opacity: saving ? 0.6 : 1 }}>
            {saving ? "Сохраняем..." : "Создать товар"}
          </button>
          <button type="button" onClick={() => router.back()} style={{ background: "transparent", color: "rgba(138,128,112,0.7)", padding: "12px 20px", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "var(--font-body)", border: "1px solid rgba(216,210,196,0.2)", cursor: "pointer" }}>
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}
