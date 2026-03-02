"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/store/cart";

function formatPrice(n: number) {
  return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(n);
}

export default function CartPage() {
  const { items, remove, setQty, clear, total } = useCart();
  const itemCount = items.reduce((s, i) => s + i.qty, 0);

  return (
    <main style={{ background: "var(--paper)", color: "var(--ink)", minHeight: "100vh", paddingTop: "120px" }}>
      <div style={{ padding: "40px 60px 80px", maxWidth: "1440px", margin: "0 auto" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "16px" }}>Корзина</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 4vw, 54px)", fontWeight: 300, lineHeight: 1.1, marginBottom: "60px" }}>
          {items.length === 0 ? "Корзина пуста" : `${itemCount} ${itemCount === 1 ? "товар" : itemCount < 5 ? "товара" : "товаров"}`}
        </h1>

        {items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ color: "var(--mid)", marginBottom: "32px" }}>Добавьте товары из каталога</p>
            <Link href="/catalog" style={{ display: "inline-block", background: "var(--ink)", color: "white", padding: "14px 32px", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none" }}>
              В каталог
            </Link>
          </div>
        ) : (
          <div className="cart-layout" style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "60px", alignItems: "start" }}>
            {/* Items list */}
            <div>
              {items.map((item) => (
                <div
                  key={item.slug}
                  style={{ display: "grid", gridTemplateColumns: "80px 1fr auto", gap: "20px", alignItems: "center", padding: "20px 0", borderBottom: "1px solid var(--line)" }}
                >
                  <Link href={`/product/${item.slug}` as never} style={{ display: "block", position: "relative", width: "80px", height: "80px", background: "var(--warm-gray)", overflow: "hidden", flexShrink: 0 }}>
                    <Image src={item.image} alt={item.alt} fill style={{ objectFit: "cover" }} sizes="80px" />
                  </Link>
                  <div>
                    <Link href={`/product/${item.slug}` as never} style={{ textDecoration: "none", color: "inherit" }}>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 400, marginBottom: "4px", color: "var(--ink)" }}>{item.title}</div>
                    </Link>
                    <div style={{ fontSize: "13px", color: "var(--mid)", marginBottom: "12px" }}>{formatPrice(item.price)}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <button onClick={() => setQty(item.slug, item.qty - 1)} style={{ width: "32px", height: "32px", border: "1px solid var(--line)", background: "none", cursor: "pointer", fontSize: "16px", color: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                      <span style={{ fontSize: "14px", minWidth: "20px", textAlign: "center" }}>{item.qty}</span>
                      <button onClick={() => setQty(item.slug, item.qty + 1)} style={{ width: "32px", height: "32px", border: "1px solid var(--line)", background: "none", cursor: "pointer", fontSize: "16px", color: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "18px", marginBottom: "10px" }}>{formatPrice(item.price * item.qty)}</div>
                    <button onClick={() => remove(item.slug)} style={{ fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--mid)", background: "none", border: "none", cursor: "pointer" }}>Удалить</button>
                  </div>
                </div>
              ))}

              <div style={{ paddingTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button onClick={clear} style={{ fontSize: "11px", color: "var(--mid)", background: "none", border: "none", cursor: "pointer", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                  Очистить корзину
                </button>
                <Link href="/catalog" className="hover-gold-link" style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--mid)", textDecoration: "none" }}>
                  ← Продолжить покупки
                </Link>
              </div>
            </div>

            {/* Summary sidebar */}
            <div style={{ position: "sticky", top: "100px", border: "1px solid var(--line)", padding: "32px" }}>
              <div style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "20px" }}>Итого</div>

              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "13px", color: "var(--mid)" }}>Товары ({itemCount})</span>
                <span style={{ fontSize: "13px", color: "var(--ink)" }}>{formatPrice(total())}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px", paddingBottom: "24px", borderBottom: "1px solid var(--line)" }}>
                <span style={{ fontSize: "13px", color: "var(--mid)" }}>Доставка</span>
                <span style={{ fontSize: "13px", color: "var(--ink)" }}>Рассчитывается</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "28px" }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "16px" }}>К оплате</span>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "24px" }}>{formatPrice(total())}</span>
              </div>

              <Link
                href="/checkout"
                style={{
                  display: "block",
                  background: "var(--ink)",
                  color: "white",
                  padding: "16px",
                  textAlign: "center",
                  fontSize: "11px",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  fontFamily: "var(--font-body)",
                  marginBottom: "16px",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--gold)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "var(--ink)"; }}
              >
                Оформить заказ →
              </Link>

              <div style={{ fontSize: "11px", color: "var(--mid)", textAlign: "center", lineHeight: 1.7 }}>
                Доставка и сборка по всей России
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
