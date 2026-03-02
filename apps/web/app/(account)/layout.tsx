import Link from "next/link";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh", paddingTop: "120px" }}>
      <div className="account-layout" style={{ maxWidth: "1440px", margin: "0 auto", padding: "40px 60px 80px", display: "grid", gridTemplateColumns: "220px 1fr", gap: "60px" }}>
        {/* Sidebar */}
        <nav style={{ paddingTop: "8px" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "24px" }}>
            Кабинет
          </div>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "4px" }}>
            {[
              { label: "История заказов", href: "/account/orders" },
              { label: "Избранное", href: "/account/wishlist" },
              { label: "Профиль", href: "/account/profile" },
            ].map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href as never}
                  className="hover-gold-link"
                  style={{ display: "block", padding: "10px 0", fontSize: "13px", color: "var(--mid)", textDecoration: "none", borderBottom: "1px solid var(--line)", letterSpacing: "0.02em", transition: "color 0.2s" }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
}
