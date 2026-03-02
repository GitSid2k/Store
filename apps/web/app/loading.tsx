export default function Loading() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", background: "var(--paper)", color: "var(--mid)" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
        <div
          style={{
            width: "32px",
            height: "32px",
            border: "2px solid var(--line)",
            borderTopColor: "var(--gold)",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <div style={{ fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase" }}>Загрузка...</div>
      </div>
    </div>
  );
}
