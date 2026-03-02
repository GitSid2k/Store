"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const inputStyle: React.CSSProperties = {
  border: "1px solid var(--line)",
  background: "var(--paper)",
  padding: "12px 14px",
  fontSize: "14px",
  color: "var(--ink)",
  outline: "none",
  fontFamily: "var(--font-body)",
  width: "100%",
  boxSizing: "border-box",
};

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
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
      const next = params.get("next") ?? "/account/orders";
      router.push(next as never);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ background: "var(--paper)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: "420px", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <Link href="/" style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 300, letterSpacing: "0.08em", color: "var(--ink)", textDecoration: "none" }}>
            Дуб & Сталь
          </Link>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", marginTop: "12px" }}>
            Вход в кабинет
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)" }}>
            Email
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="ivan@example.com"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              style={inputStyle}
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)" }}>
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
            <div style={{ fontSize: "13px", color: "#e05252", padding: "10px 14px", background: "rgba(224,82,82,0.08)", border: "1px solid rgba(224,82,82,0.2)" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ marginTop: "8px", background: "var(--ink)", color: "white", padding: "14px", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "var(--font-body)", border: "none", cursor: "pointer", opacity: loading ? 0.6 : 1 }}
          >
            {loading ? "Входим..." : "Войти"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "32px", fontSize: "13px", color: "var(--mid)" }}>
          Нет аккаунта?{" "}
          <Link href={"/register" as never} style={{ color: "var(--gold)", textDecoration: "none", borderBottom: "1px solid var(--gold)", paddingBottom: "1px" }}>
            Зарегистрироваться
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
