import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "#0F0E0C", minHeight: "100vh", color: "#FAFAF7" }}>
      {/* Admin nav */}
      <nav style={{ borderBottom: "1px solid rgba(216,210,196,0.15)", padding: "0 40px", display: "flex", alignItems: "center", gap: "0", height: "60px" }}>
        <Link href={"/admin" as never} style={{ fontFamily: "var(--font-display)", fontSize: "14px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#9A7A3A", textDecoration: "none", marginRight: "40px", flexShrink: 0 }}>
          Дуб & Сталь · Admin
        </Link>
        <div style={{ display: "flex", gap: "0", flex: 1 }}>
          {[
            { label: "Дашборд", href: "/admin" },
            { label: "Товары", href: "/admin/products" },
            { label: "Категории", href: "/admin/categories" },
            { label: "Заказы", href: "/admin/orders" },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href as never}
              prefetch={false}
              style={{ padding: "0 20px", height: "60px", display: "flex", alignItems: "center", fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(138,128,112,0.8)", textDecoration: "none", borderRight: "1px solid rgba(216,210,196,0.1)", transition: "color 0.2s" }}
            >
              {label}
            </Link>
          ))}
        </div>
        <Link href="/" style={{ fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(138,128,112,0.5)", textDecoration: "none" }}>
          ← Сайт
        </Link>
      </nav>
      <div style={{ padding: "40px" }}>
        {children}
      </div>
    </div>
  );
}
