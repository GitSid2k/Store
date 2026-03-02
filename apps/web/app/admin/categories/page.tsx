"use client";

import { useEffect, useState } from "react";

type Category = { id: string; slug: string; name: string; _count?: { products: number } };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ name: "", slug: "" });
  const [saving, setSaving] = useState(false);

  async function load() {
    const r = await fetch("/api/admin/categories");
    setCategories(await r.json());
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", slug: "" });
    await load();
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Удалить категорию? Все товары этой категории потеряют привязку.")) return;
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    await load();
  }

  const inputStyle: React.CSSProperties = {
    border: "1px solid rgba(216,210,196,0.2)",
    background: "rgba(255,255,255,0.05)",
    padding: "10px 14px",
    fontSize: "14px",
    color: "#FAFAF7",
    outline: "none",
    fontFamily: "var(--font-body)",
  };

  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 300, color: "#FAFAF7", marginBottom: "32px" }}>Категории</h1>

      {/* Add form */}
      <form onSubmit={handleCreate} style={{ display: "flex", gap: "16px", marginBottom: "40px", alignItems: "flex-end" }}>
        <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(154,122,58,0.9)" }}>
          Название
          <input required value={form.name} onChange={(e) => {
            const name = e.target.value;
            setForm({ name, slug: name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") });
          }} style={inputStyle} placeholder="Гостиная" />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(154,122,58,0.9)" }}>
          Slug
          <input required value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} style={inputStyle} placeholder="living" />
        </label>
        <button type="submit" disabled={saving} style={{ background: "#9A7A3A", color: "white", padding: "10px 20px", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", border: "none", cursor: "pointer", fontFamily: "var(--font-body)", height: "42px" }}>
          {saving ? "..." : "+ Добавить"}
        </button>
      </form>

      {/* List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {categories.map((cat) => (
          <div key={cat.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", border: "1px solid rgba(216,210,196,0.12)" }}>
            <div>
              <span style={{ fontSize: "14px", color: "#FAFAF7", marginRight: "16px" }}>{cat.name}</span>
              <span style={{ fontSize: "11px", color: "rgba(138,128,112,0.6)", letterSpacing: "0.1em" }}>{cat.slug}</span>
            </div>
            <button onClick={() => handleDelete(cat.id)} style={{ fontSize: "11px", color: "rgba(248,113,113,0.7)", background: "none", border: "none", cursor: "pointer", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Удалить
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
