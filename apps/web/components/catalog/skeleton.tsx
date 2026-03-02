export function CatalogSkeleton() {
  return (
    <div className="product-grid">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          style={{
            border: "1px solid var(--line)",
            background: "white",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              aspectRatio: "3/4",
              background: "var(--warm-gray)",
              animation: `skeletonPulse 1.5s ease-in-out ${i * 0.1}s infinite`,
            }}
          />
          <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ height: "10px", width: "60%", background: "var(--line)", borderRadius: "2px", animation: `skeletonPulse 1.5s ease-in-out ${i * 0.1 + 0.1}s infinite` }} />
            <div style={{ height: "20px", width: "85%", background: "var(--warm-gray)", borderRadius: "2px", animation: `skeletonPulse 1.5s ease-in-out ${i * 0.1 + 0.2}s infinite` }} />
            <div style={{ height: "18px", width: "40%", background: "var(--line)", borderRadius: "2px", animation: `skeletonPulse 1.5s ease-in-out ${i * 0.1 + 0.3}s infinite` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
