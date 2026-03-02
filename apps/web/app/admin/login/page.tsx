"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const inputStyle: React.CSSProperties = {
  border: "1px solid rgba(216,210,196,0.2)",
  background: "rgba(255,255,255,0.03)",
  padding: "12px 14px",
  fontSize: "14px",
  color: "#FAFAF7",
  outline: "none",
  fontFamily: "var(--font-body)",
  width: "100%",
  boxSizing: "border-box",
};

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) { setError(data.error ?? "Ошибка"); return; }
      // Redirect to admin dashboard
      router.push("/admin");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ background: "#0F0E0C", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: "420px", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 300, letterSpacing: "0.08em", color: "#9A7A3A", marginBottom: "8px" }}>
            Дуб & Сталь
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "#FAFAF7" }}>
            Вход в админку
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#9A7A3A" }}>
            Email
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="admin@example.com"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              style={inputStyle}
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#9A7A3A" }}>
            Пароль
            <input
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              style={inputStyle}
            />
          </label>

          {error && (
            <div style={{ fontSize: "13px", color: "#f87171", padding: "10px 14px", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ marginTop: "8px", background: "#9A7A3A", color: "white", padding: "14px", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "var(--font-body)", border: "none", cursor: "pointer", opacity: loading ? 0.6 : 1 }}
          >
            {loading ? "Входим..." : "Войти"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "32px", fontSize: "13px", color: "rgba(138,128,112,0.7)" }}>
          <a href="/" style={{ color: "#9A7A3A", textDecoration: "none", borderBottom: "1px solid #9A7A3A", paddingBottom: "1px" }}>
            ← Вернуться на сайт
          </a>
        </div>
      </div>
    </main>
  );
}
