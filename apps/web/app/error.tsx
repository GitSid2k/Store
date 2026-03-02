"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      style={{
        background: "var(--paper)",
        color: "var(--ink)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "80px",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: "540px", padding: "0 40px" }}>
        <div
          style={{
            width: "64px",
            height: "64px",
            border: "1px solid var(--line)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 32px",
            fontSize: "24px",
            color: "var(--mid)",
          }}
        >
          !
        </div>

        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "11px",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "var(--gold)",
            marginBottom: "16px",
          }}
        >
          Что-то пошло не так
        </div>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(24px, 3vw, 36px)",
            fontWeight: 300,
            lineHeight: 1.2,
            marginBottom: "20px",
          }}
        >
          Произошла<br />
          <em style={{ fontStyle: "italic", color: "var(--gold)" }}>ошибка</em>
        </h1>

        <p
          style={{
            color: "var(--mid)",
            fontSize: "15px",
            lineHeight: 1.8,
            marginBottom: "48px",
          }}
        >
          Мы уже знаем об этой проблеме и работаем над её устранением.
          Попробуйте обновить страницу.
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <button
            onClick={reset}
            style={{
              background: "var(--ink)",
              color: "white",
              padding: "14px 32px",
              fontSize: "11px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              fontFamily: "var(--font-body)",
              border: "none",
              cursor: "pointer",
            }}
          >
            Попробовать снова
          </button>
          <Link
            href="/"
            style={{
              background: "transparent",
              color: "var(--ink)",
              padding: "14px 32px",
              fontSize: "11px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              textDecoration: "none",
              fontFamily: "var(--font-body)",
              border: "1px solid var(--line)",
            }}
          >
            На главную
          </Link>
        </div>
      </div>
    </main>
  );
}
