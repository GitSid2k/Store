"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/store/cart";
import { useRouter } from "next/navigation";

type Step = 1 | 2 | 3;

type ContactForm = { name: string; email: string; phone: string };
type DeliveryForm = { city: string; address: string; zip: string; comment: string };

function formatPrice(n: number) {
  return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(n);
}

const inputStyle: React.CSSProperties = {
  border: "1px solid var(--line)",
  padding: "12px 14px",
  fontSize: "14px",
  color: "var(--ink)",
  background: "var(--paper)",
  outline: "none",
  fontFamily: "var(--font-body)",
  width: "100%",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

const labelStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  fontSize: "10px",
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "var(--gold)",
};

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);

  const [contact, setContact] = useState<ContactForm>({ name: "", email: "", phone: "" });
  const [delivery, setDelivery] = useState<DeliveryForm>({ city: "Москва", address: "", zip: "", comment: "" });

  const totalAmount = total();
  const itemCount = items.reduce((s, i) => s + i.qty, 0);

  const digitsInPhone = contact.phone.replace(/\D/g, "");
  const isContactValid = Boolean(contact.name.trim() && contact.email.trim() && digitsInPhone.length >= 10);

  async function handleSubmit() {
    if (submitting) return;
    if (!isContactValid) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          address: `${delivery.city}, ${delivery.address}`,
          items: items.map((i) => ({ slug: i.slug, title: i.title, image: i.image, qty: i.qty, price: i.price })),
          total: totalAmount,
        }),
      });
      
      const data = await res.json();
      
      if (data.url) {
        clear();
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch {
      setSubmitting(false);
      // Optional: show error toast here
    }
  }

  if (items.length === 0) {
    return (
      <main style={{ background: "var(--paper)", minHeight: "100vh", paddingTop: "140px", display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)" }}>Корзина пуста</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 300 }}>Нечего оформлять</h1>
        <Link href="/catalog" style={{ fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", textDecoration: "none", borderBottom: "1px solid var(--gold)", paddingBottom: "2px" }}>
          Перейти в каталог
        </Link>
      </main>
    );
  }

  return (
    <main style={{ background: "var(--paper)", color: "var(--ink)", minHeight: "100vh", paddingTop: "120px" }}>
      <div style={{ padding: "40px 60px 100px", maxWidth: "1280px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "48px" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "12px" }}>
            Оформление заказа
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3vw, 42px)", fontWeight: 300, lineHeight: 1.1 }}>
            {step === 1 ? "Контактные данные" : step === 2 ? "Доставка" : "Подтверждение"}
          </h1>
        </div>

        {/* Step indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: "0", marginBottom: "56px" }}>
          {([1, 2, 3] as Step[]).map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center" }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "50%",
                border: `1px solid ${s <= step ? "var(--gold)" : "var(--line)"}`,
                background: s < step ? "var(--gold)" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "11px", letterSpacing: "0.1em",
                color: s < step ? "white" : s === step ? "var(--gold)" : "var(--mid)",
                transition: "all 0.3s",
                cursor: s < step ? "pointer" : "default",
              }}
              onClick={() => s < step && setStep(s)}
              >
                {s < step ? "✓" : s}
              </div>
              <span style={{ marginLeft: "10px", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: s === step ? "var(--ink)" : "var(--mid)", marginRight: "32px" }}>
                {s === 1 ? "Контакты" : s === 2 ? "Доставка" : "Итого"}
              </span>
              {i < 2 && <div style={{ width: "60px", height: "1px", background: step > s ? "var(--gold)" : "var(--line)", marginRight: "16px", transition: "background 0.3s" }} />}
            </div>
          ))}
        </div>

        <div className="checkout-layout" style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "60px", alignItems: "start" }}>

          {/* Form area */}
          <div>
            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <label style={labelStyle}>
                  Имя и фамилия *
                  <input
                    required
                    value={contact.name}
                    onChange={(e) => setContact((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Иван Иванов"
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = "var(--gold)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "var(--line)"; }}
                  />
                </label>
                <label style={labelStyle}>
                  Email *
                  <input
                    required
                    type="email"
                    value={contact.email}
                    onChange={(e) => setContact((p) => ({ ...p, email: e.target.value }))}
                    placeholder="ivan@example.com"
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = "var(--gold)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "var(--line)"; }}
                  />
                </label>
                <label style={labelStyle}>
                  Телефон *
                  <input
                    type="tel"
                    required
                    value={contact.phone}
                    onChange={(e) => setContact((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="+7 (999) 000-00-00"
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = "var(--gold)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "var(--line)"; }}
                  />
                </label>
                <button
                  disabled={!isContactValid}
                  onClick={() => setStep(2)}
                  style={{ marginTop: "8px", background: !isContactValid ? "var(--line)" : "var(--ink)", color: "white", padding: "16px 40px", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", fontFamily: "var(--font-body)", border: "none", cursor: !isContactValid ? "not-allowed" : "pointer", alignSelf: "flex-start", transition: "background 0.2s" }}
                >
                  Далее — Доставка →
                </button>
              </div>
            )}

            {step === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <label style={labelStyle}>
                  Город *
                  <input
                    required
                    value={delivery.city}
                    onChange={(e) => setDelivery((p) => ({ ...p, city: e.target.value }))}
                    placeholder="Москва"
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = "var(--gold)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "var(--line)"; }}
                  />
                </label>
                <label style={labelStyle}>
                  Улица, дом, квартира *
                  <input
                    required
                    value={delivery.address}
                    onChange={(e) => setDelivery((p) => ({ ...p, address: e.target.value }))}
                    placeholder="ул. Пушкина, д. 1, кв. 10"
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = "var(--gold)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "var(--line)"; }}
                  />
                </label>
                <label style={labelStyle}>
                  Почтовый индекс
                  <input
                    value={delivery.zip}
                    onChange={(e) => setDelivery((p) => ({ ...p, zip: e.target.value }))}
                    placeholder="123456"
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = "var(--gold)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "var(--line)"; }}
                  />
                </label>
                <label style={labelStyle}>
                  Комментарий к заказу
                  <textarea
                    value={delivery.comment}
                    onChange={(e) => setDelivery((p) => ({ ...p, comment: e.target.value }))}
                    placeholder="Удобное время доставки, особые пожелания..."
                    rows={3}
                    style={{ ...inputStyle, resize: "vertical" }}
                    onFocus={(e) => { e.target.style.borderColor = "var(--gold)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "var(--line)"; }}
                  />
                </label>
                <div style={{ display: "flex", gap: "12px" }}>
                  <button onClick={() => setStep(1)} style={{ padding: "16px 24px", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "var(--font-body)", border: "1px solid var(--line)", background: "none", cursor: "pointer", color: "var(--mid)" }}>
                    ← Назад
                  </button>
                  <button
                    disabled={!delivery.address}
                    onClick={() => setStep(3)}
                    style={{ flex: 1, background: !delivery.address ? "var(--line)" : "var(--ink)", color: "white", padding: "16px 40px", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", fontFamily: "var(--font-body)", border: "none", cursor: !delivery.address ? "not-allowed" : "pointer", transition: "background 0.2s" }}
                  >
                    Далее — Подтверждение →
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <div style={{ border: "1px solid var(--line)", padding: "28px", marginBottom: "24px" }}>
                  <div style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "16px" }}>Контактные данные</div>
                  <div style={{ fontSize: "14px", color: "var(--ink)", lineHeight: 1.8 }}>
                    <div>{contact.name}</div>
                    <div style={{ color: "var(--mid)" }}>{contact.email}</div>
                    <div style={{ color: "var(--mid)" }}>{contact.phone}</div>
                  </div>
                </div>
                <div style={{ border: "1px solid var(--line)", padding: "28px", marginBottom: "32px" }}>
                  <div style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "16px" }}>Адрес доставки</div>
                  <div style={{ fontSize: "14px", color: "var(--ink)", lineHeight: 1.8 }}>
                    <div>{delivery.city}, {delivery.address}</div>
                    {delivery.zip && <div style={{ color: "var(--mid)" }}>Индекс: {delivery.zip}</div>}
                    {delivery.comment && <div style={{ color: "var(--mid)", marginTop: "8px" }}>{delivery.comment}</div>}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <button onClick={() => setStep(2)} style={{ padding: "16px 24px", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "var(--font-body)", border: "1px solid var(--line)", background: "none", cursor: "pointer", color: "var(--mid)" }}>
                    ← Назад
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    style={{ flex: 1, background: submitting ? "var(--gold)" : "var(--ink)", color: "white", padding: "16px 40px", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", fontFamily: "var(--font-body)", border: "none", cursor: submitting ? "not-allowed" : "pointer", transition: "background 0.2s", opacity: submitting ? 0.8 : 1 }}
                  >
                    {submitting ? "Оформляем..." : "Подтвердить заказ"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order summary sidebar */}
          <div style={{ position: "sticky", top: "100px", border: "1px solid var(--line)", padding: "32px" }}>
            <div style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "20px" }}>
              Ваш заказ · {itemCount} {itemCount === 1 ? "товар" : itemCount < 5 ? "товара" : "товаров"}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
              {items.map((item) => (
                <div key={item.slug} style={{ display: "grid", gridTemplateColumns: "56px 1fr", gap: "12px", alignItems: "center" }}>
                  <div style={{ position: "relative", width: "56px", height: "56px", background: "var(--warm-gray)", overflow: "hidden", flexShrink: 0 }}>
                    <Image src={item.image} alt={item.alt} fill style={{ objectFit: "cover" }} sizes="56px" />
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", color: "var(--ink)", lineHeight: 1.3, marginBottom: "2px" }}>{item.title}</div>
                    <div style={{ fontSize: "12px", color: "var(--mid)" }}>
                      {item.qty > 1 && `${item.qty} × `}{formatPrice(item.price * item.qty)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ borderTop: "1px solid var(--line)", paddingTop: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "13px", color: "var(--mid)" }}>Стоимость товаров</span>
                <span style={{ fontSize: "13px", color: "var(--ink)" }}>{formatPrice(totalAmount)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                <span style={{ fontSize: "13px", color: "var(--mid)" }}>Доставка</span>
                <span style={{ fontSize: "13px", color: "var(--ink)" }}>Рассчитывается</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "16px", color: "var(--ink)" }}>Итого</span>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "22px", color: "var(--ink)" }}>{formatPrice(totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
