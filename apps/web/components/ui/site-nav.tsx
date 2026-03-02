"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { CartButton } from "@/components/ui/cart-button";
import { NavAuth } from "@/components/ui/nav-auth";

const NAV_LINKS = [
  { label: "Каталог",    href: "/catalog" },
  { label: "Коллекции", href: "/collections" },
  { label: "О бренде",  href: "/about" },
  { label: "Контакты",  href: "/contacts" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <nav
        className="site-nav"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 900,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "24px 60px",
          background: scrolled ? "rgba(250,250,247,0.95)" : "rgba(250,250,247,0.88)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--line)",
          transition: "background 0.3s",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "18px",
            fontWeight: 500,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--ink)",
            textDecoration: "none",
          }}
        >
          Дуб & Сталь
        </Link>

        {/* Desktop links */}
        <ul
          style={{
            display: "flex",
            gap: "40px",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
          className="desktop-nav"
        >
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href as never}
                className="hover-gold-link"
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--mid)",
                  textDecoration: "none",
                }}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div className="desktop-nav">
            <NavAuth />
          </div>
          <CartButton />

          {/* Hamburger — mobile only */}
          <button
            className="mobile-hamburger"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              flexDirection: "column",
              gap: "5px",
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: "block",
                  width: "22px",
                  height: "1px",
                  background: "var(--ink)",
                  transition: "all 0.3s",
                  transformOrigin: "center",
                  transform:
                    open
                      ? i === 0 ? "rotate(45deg) translate(4px, 4px)"
                      : i === 1 ? "scaleX(0)"
                      : "rotate(-45deg) translate(4px, -4px)"
                      : "none",
                  opacity: open && i === 1 ? 0 : 1,
                }}
              />
            ))}
          </button>
        </div>
      </nav>

      {/* Mobile drawer overlay */}
      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 850,
            background: "rgba(15,14,12,0.4)",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(320px, 85vw)",
          background: "var(--paper)",
          zIndex: 910,
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
          display: "flex",
          flexDirection: "column",
          padding: "80px 40px 40px",
          borderLeft: "1px solid var(--line)",
        }}
      >
        <nav style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href as never}
              onClick={() => setOpen(false)}
              style={{
                fontSize: "13px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--mid)",
                textDecoration: "none",
                padding: "18px 0",
                borderBottom: "1px solid var(--line)",
                display: "block",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--gold)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--mid)"; }}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div style={{ marginTop: "32px" }}>
          <NavAuth />
        </div>

        <div style={{ marginTop: "auto", paddingTop: "24px", borderTop: "1px solid var(--line)" }}>
          <p style={{ fontSize: "11px", color: "var(--line)", letterSpacing: "0.1em" }}>
            © {new Date().getFullYear()} Дуб & Сталь
          </p>
        </div>
      </div>
    </>
  );
}
