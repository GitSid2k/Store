"use client";

import { useState } from "react";

export default function ContactsPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <main style={{ background: "var(--paper)", color: "var(--ink)", minHeight: "100vh", paddingTop: "120px" }}>
      <div style={{ padding: "60px 60px 120px", maxWidth: "1440px", margin: "0 auto" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "20px" }}>
          Контакты
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 300, lineHeight: 1.05, marginBottom: "60px" }}>
          Свяжитесь<br /><em style={{ fontStyle: "italic", color: "var(--gold)" }}>с нами</em>
        </h1>

        <div className="contacts-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "120px", borderTop: "1px solid var(--line)", paddingTop: "60px" }}>
          {/* Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
            {[
              { label: "Адрес", lines: ["Московская область,", "г. Мытищи, ул. Мебельная, 12"] },
              { label: "Телефон", lines: ["+7 (495) 123-45-67"] },
              { label: "Email", lines: ["hello@dub-stal.ru"] },
              { label: "Режим работы", lines: ["Пн–Пт: 10:00–19:00", "Сб: 11:00–17:00", "Вс: выходной"] },
            ].map((item) => (
              <div key={item.label}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "10px" }}>{item.label}</div>
                {item.lines.map((l, i) => (
                  <div key={i} style={{ fontSize: "15px", color: "var(--mid)", lineHeight: 1.8 }}>{l}</div>
                ))}
              </div>
            ))}
          </div>

          {/* Form */}
          <div>
            {sent ? (
              <div style={{ padding: "40px 0" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 300, marginBottom: "16px" }}>Сообщение отправлено</div>
                <p style={{ color: "var(--mid)", lineHeight: 1.8 }}>Мы ответим вам в течение одного рабочего дня.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {[
                  { name: "name", label: "Имя", placeholder: "Иван Иванов" },
                  { name: "email", label: "Email", placeholder: "ivan@example.com" },
                ].map((f) => (
                  <label key={f.name} style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)" }}>
                    {f.label}
                    <input
                      required
                      placeholder={f.placeholder}
                      value={form[f.name as keyof typeof form]}
                      onChange={(e) => setForm((p) => ({ ...p, [f.name]: e.target.value }))}
                      style={{ border: "1px solid var(--line)", padding: "12px 14px", fontSize: "14px", color: "var(--ink)", background: "var(--paper)", outline: "none", fontFamily: "var(--font-body)" }}
                    />
                  </label>
                ))}
                <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)" }}>
                  Сообщение
                  <textarea
                    required
                    rows={5}
                    placeholder="Расскажите о вашем проекте или задайте вопрос..."
                    value={form.message}
                    onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                    style={{ border: "1px solid var(--line)", padding: "12px 14px", fontSize: "14px", color: "var(--ink)", background: "var(--paper)", outline: "none", fontFamily: "var(--font-body)", resize: "vertical" }}
                  />
                </label>
                <button
                  type="submit"
                  style={{ background: "var(--ink)", color: "white", padding: "14px 32px", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "var(--font-body)", border: "none", cursor: "pointer", alignSelf: "flex-start" }}
                >
                  Отправить
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
