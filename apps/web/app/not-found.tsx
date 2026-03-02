import Link from "next/link";

export default function NotFound() {
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
            fontFamily: "var(--font-display)",
            fontSize: "clamp(80px, 12vw, 140px)",
            fontWeight: 300,
            lineHeight: 1,
            letterSpacing: "-0.04em",
            color: "transparent",
            WebkitTextStroke: "1px var(--line)",
            marginBottom: "32px",
          }}
        >
          404
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
          Страница не найдена
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
          Этой страницы<br />
          <em style={{ fontStyle: "italic", color: "var(--gold)" }}>не существует</em>
        </h1>

        <p
          style={{
            color: "var(--mid)",
            fontSize: "15px",
            lineHeight: 1.8,
            marginBottom: "48px",
          }}
        >
          Возможно, ссылка устарела или страница была перемещена.
          Вернитесь на главную или откройте каталог.
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <Link
            href="/"
            style={{
              background: "var(--ink)",
              color: "white",
              padding: "14px 32px",
              fontSize: "11px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              textDecoration: "none",
              fontFamily: "var(--font-body)",
            }}
          >
            На главную
          </Link>
          <Link
            href="/catalog"
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
            Каталог
          </Link>
        </div>
      </div>
    </main>
  );
}
