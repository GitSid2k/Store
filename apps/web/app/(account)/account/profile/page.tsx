"use client";

import { useState, useEffect } from "react";

export default function ProfilePage() {
  const [form, setForm] = useState({ name: "", email: "" });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d) setForm({ name: d.name, email: d.email });
        else setForm({ name: "", email: "" });
      })
      .catch(() => setForm({ name: "", email: "" }))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 300, lineHeight: 1.1, marginBottom: "40px" }}>
        Профиль
      </h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: "480px", display: "flex", flexDirection: "column", gap: "20px" }}>
        {[
          { name: "name", label: "Имя", placeholder: "Ваше имя" },
          { name: "email", label: "Email", placeholder: "email@example.com" },
        ].map((f) => (
          <label key={f.name} style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)" }}>
            {f.label}
            <input
              placeholder={loading ? "Загрузка..." : f.placeholder}
              value={form[f.name as keyof typeof form]}
              onChange={(e) => setForm((p) => ({ ...p, [f.name]: e.target.value }))}
              disabled={loading}
              style={{ border: "1px solid var(--line)", padding: "12px 14px", fontSize: "14px", color: "var(--ink)", background: "var(--paper)", outline: "none", fontFamily: "var(--font-body)", opacity: loading ? 0.6 : 1 }}
            />
          </label>
        ))}
        <div style={{ paddingTop: "8px" }}>
          <button
            type="submit"
            style={{ background: "var(--ink)", color: "white", padding: "14px 32px", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "var(--font-body)", border: "none", cursor: "pointer" }}
          >
            {saved ? "Сохранено ✓" : "Сохранить"}
          </button>
        </div>
      </form>

      <div style={{ marginTop: "60px", paddingTop: "40px", borderTop: "1px solid var(--line)" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--mid)", marginBottom: "16px" }}>
          Информация
        </div>
        <p style={{ color: "var(--mid)", fontSize: "14px", lineHeight: 1.8 }}>
          Ваши данные используются только для оформления заказов и связи с вами. Мы не передаём информацию третьим лицам.
        </p>
      </div>
    </div>
  );
}
