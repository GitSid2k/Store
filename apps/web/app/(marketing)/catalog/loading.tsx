export default function CatalogLoading() {
  return (
    <main style={{ background: "var(--paper)", minHeight: "100vh", paddingTop: "80px" }}>
      {/* Header skeleton */}
      <div style={{ padding: "80px 60px", borderBottom: "1px solid var(--line)" }}>
        <div className="skeleton" style={{ height: "11px", width: "80px", marginBottom: "20px", borderRadius: "2px" }} />
        <div className="skeleton" style={{ height: "54px", width: "340px", marginBottom: "16px", borderRadius: "2px" }} />
        <div className="skeleton" style={{ height: "15px", width: "480px", borderRadius: "2px" }} />
      </div>

      {/* Filter skeleton */}
      <div style={{ padding: "40px 60px", borderBottom: "1px solid var(--line)", display: "flex", gap: "24px" }}>
        {[200, 160, 180].map((w, i) => (
          <div key={i} className="skeleton" style={{ height: "42px", width: w, borderRadius: "2px" }} />
        ))}
      </div>

      {/* Grid skeleton */}
      <div className="product-grid" style={{ padding: "80px 60px" }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} style={{ border: "1px solid var(--line)", background: "var(--paper)" }}>
            <div className="skeleton" style={{ aspectRatio: "3/4", width: "100%", display: "block" }} />
            <div style={{ padding: "20px 24px" }}>
              <div className="skeleton" style={{ height: "9px", width: "50%", marginBottom: "10px", borderRadius: "2px" }} />
              <div className="skeleton" style={{ height: "22px", width: "80%", marginBottom: "8px", borderRadius: "2px" }} />
              <div className="skeleton" style={{ height: "18px", width: "60%", borderRadius: "2px" }} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
