"use client";

export function FilterButtons() {
  return (
    <div style={{ display: "flex", gap: "12px" }}>
      <button
        type="submit"
        style={{
          background: "var(--ink)",
          color: "white",
          padding: "14px 28px",
          fontSize: "11px",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          fontFamily: "var(--font-body)",
          fontWeight: 400,
          border: "none",
          cursor: "pointer",
          transition: "background 0.2s",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "var(--gold)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "var(--ink)"; }}
      >
        Применить
      </button>
      <a
        href="/catalog"
        style={{
          border: "1px solid var(--ink)",
          color: "var(--ink)",
          padding: "14px 28px",
          fontSize: "11px",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          fontFamily: "var(--font-body)",
          fontWeight: 400,
          textDecoration: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          transition: "border-color 0.2s, color 0.2s",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--ink)"; e.currentTarget.style.color = "var(--ink)"; }}
      >
        Сбросить
      </a>
    </div>
  );
}
