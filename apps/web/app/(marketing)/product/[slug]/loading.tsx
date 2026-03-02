export default function ProductLoading() {
  return (
    <main style={{ background: "var(--paper)", color: "var(--ink)", minHeight: "100vh" }}>
      <div style={{ padding: "120px 60px 0", display: "flex", gap: "8px", alignItems: "center" }}>
        <div style={{ height: "10px", width: "60px", background: "var(--line)", borderRadius: "2px", animation: "skeletonPulse 1.5s ease-in-out infinite" }} />
        <div style={{ height: "10px", width: "8px", background: "var(--line)", borderRadius: "2px" }} />
        <div style={{ height: "10px", width: "120px", background: "var(--warm-gray)", borderRadius: "2px", animation: "skeletonPulse 1.5s ease-in-out 0.1s infinite" }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: "60px", padding: "40px 60px 80px" }}>
        {/* Gallery skeleton */}
        <div>
          <div style={{ width: "100%", aspectRatio: "4/5", background: "var(--warm-gray)", marginBottom: "16px", animation: "skeletonPulse 1.5s ease-in-out infinite" }} />
          <div style={{ display: "flex", gap: "12px" }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ width: "72px", height: "72px", background: "var(--warm-gray)", animation: `skeletonPulse 1.5s ease-in-out ${i * 0.1}s infinite` }} />
            ))}
          </div>
        </div>

        {/* Info skeleton */}
        <div style={{ paddingTop: "8px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ height: "22px", width: "100px", background: "var(--warm-gray)", animation: "skeletonPulse 1.5s ease-in-out infinite" }} />
          <div style={{ height: "48px", width: "80%", background: "var(--warm-gray)", animation: "skeletonPulse 1.5s ease-in-out 0.1s infinite" }} />
          <div style={{ height: "16px", width: "90%", background: "var(--line)", borderRadius: "2px", animation: "skeletonPulse 1.5s ease-in-out 0.2s infinite" }} />
          <div style={{ height: "16px", width: "60%", background: "var(--line)", borderRadius: "2px", animation: "skeletonPulse 1.5s ease-in-out 0.3s infinite" }} />
          <div style={{ height: "36px", width: "140px", background: "var(--warm-gray)", animation: "skeletonPulse 1.5s ease-in-out 0.4s infinite", marginTop: "8px" }} />
          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <div style={{ height: "50px", flex: 1, background: "var(--warm-gray)", animation: "skeletonPulse 1.5s ease-in-out 0.5s infinite" }} />
            <div style={{ height: "50px", width: "44px", background: "var(--line)", animation: "skeletonPulse 1.5s ease-in-out 0.6s infinite" }} />
          </div>
        </div>
      </div>
    </main>
  );
}
