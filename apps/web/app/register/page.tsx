"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) { setError("Пароли не совпадают."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) { setError(data.error ?? "Ошибка"); return; }
      router.push("/orders");
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
            Регистрация
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {[
            { name: "name",     label: "Имя",            type: "text",     placeholder: "Иван Иванов",       ac: "name" },
            { name: "email",    label: "Email",           type: "email",    placeholder: "ivan@example.com",   ac: "email" },
            { name: "password", label: "Пароль",          type: "password", placeholder: "Минимум 6 символов", ac: "new-password" },
            { name: "confirm",  label: "Повторите пароль",type: "password", placeholder: "••••••••",           ac: "new-password" },
          ].map((f) => (
            <label key={f.name} style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)" }}>
              {f.label}
              <input
                type={f.type}
                required
                autoComplete={f.ac}
                placeholder={f.placeholder}
                value={form[f.name as keyof typeof form]}
                onChange={(e) => setForm((p) => ({ ...p, [f.name]: e.target.value }))}
                style={inputStyle}
              />
            </label>
          ))}

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
            {loading ? "Регистрируем..." : "Создать аккаунт"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "32px", fontSize: "13px", color: "var(--mid)" }}>
          Уже есть аккаунт?{" "}
          <Link href={"/login" as never} style={{ color: "var(--gold)", textDecoration: "none", borderBottom: "1px solid var(--gold)", paddingBottom: "1px" }}>
            Войти
          </Link>
        </div>
      </div>
    </main>
  );
}
