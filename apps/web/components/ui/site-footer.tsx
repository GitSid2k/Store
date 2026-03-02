"use client";

export function SiteFooter() {
  return (
    <footer style={{ borderTop: "1px solid var(--line)", background: "var(--paper)" }}>
      {/* Main grid */}
      <div
        className="footer-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
          gap: "48px",
          padding: "64px 60px 48px",
          borderBottom: "1px solid var(--line)",
        }}
      >
        {/* Brand */}
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "20px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink)", marginBottom: "16px" }}>
            Дуб & Сталь
          </div>
          <p style={{ fontSize: "13px", color: "var(--mid)", lineHeight: 1.9, marginBottom: "24px", maxWidth: "220px" }}>
            Авторская мебель из массива дерева и кованого металла. Создаётся вручную в Подмосковье.
          </p>
          <div style={{ display: "flex", gap: "12px" }}>
            {["VK", "TG", "IN"].map((s) => (
              <a
                key={s}
                href="#"
                style={{ width: "32px", height: "32px", border: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", letterSpacing: "0.05em", color: "var(--mid)", textDecoration: "none", transition: "border-color 0.2s, color 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--line)"; e.currentTarget.style.color = "var(--mid)"; }}
              >
                {s}
              </a>
            ))}
          </div>
        </div>

        {/* Catalog */}
        <div>
          <div style={{ fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "20px" }}>Каталог</div>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              { label: "Все товары", href: "/catalog" },
              { label: "Коллекции", href: "/collections" },
              { label: "Новинки", href: "/catalog?sort=new" },
              { label: "В наличии", href: "/catalog?status=IN_STOCK" },
            ].map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  style={{ fontSize: "13px", color: "var(--mid)", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "var(--gold)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "var(--mid)"; }}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <div style={{ fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "20px" }}>О нас</div>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              { label: "О бренде", href: "/about" },
              { label: "Контакты", href: "/contacts" },
              { label: "Доставка", href: "/contacts" },
              { label: "Гарантия", href: "/contacts" },
            ].map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  style={{ fontSize: "13px", color: "var(--mid)", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "var(--gold)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "var(--mid)"; }}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contacts */}
        <div>
          <div style={{ fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "20px" }}>Контакты</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              "Московская обл., Подмосковье",
              "+7 (495) 000-00-00",
              "info@dubstal.ru",
              "Пн–Пт: 10:00–18:00",
            ].map((t) => (
              <p key={t} style={{ fontSize: "13px", color: "var(--mid)", lineHeight: 1.5, margin: 0 }}>{t}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ padding: "20px 60px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <p style={{ fontSize: "11px", color: "var(--line)", letterSpacing: "0.1em", margin: 0 }}>
          © {new Date().getFullYear()} Дуб & Сталь — все права защищены
        </p>
        <div style={{ display: "flex", gap: "24px" }}>
          {["Политика конфиденциальности", "Оферта"].map((t) => (
            <a
              key={t}
              href="#"
              style={{ fontSize: "11px", color: "var(--line)", textDecoration: "none", letterSpacing: "0.05em", transition: "color 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--mid)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--line)"; }}
            >
              {t}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
