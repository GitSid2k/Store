"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/store/cart";
import { WishlistButton } from "@/components/ui/wishlist-button";

type Spec = { key: string; value: string };
type Review = { rating: number; comment: string | null; createdAt: Date | string };

type Props = {
  badge: string;
  specs: Spec[];
  slug: string;
  title: string;
  price: number;
  image: string;
  alt: string;
  description?: string;
  ratingAvg?: number | null;
  ratingCount?: number | null;
  reviews?: Review[];
};

const TABS = ["Описание", "Характеристики", "Отзывы"] as const;

export function ProductInteractive({
  badge, specs, slug, title, price, image, alt,
  description, ratingAvg, ratingCount, reviews = [],
}: Props) {
  const add = useCart((s) => s.add);
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<typeof TABS[number]>("Описание");
  const priceFormatted = new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(price);

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewName, setReviewName] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewState, setReviewState] = useState<"idle" | "sending" | "done" | "error">("idle");

  function handleAddToCart() {
    for (let i = 0; i < qty; i++) add({ slug, title, price, image, alt });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!reviewName.trim()) return;
    setReviewState("sending");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productSlug: slug, rating: reviewRating, comment: reviewComment, authorName: reviewName }),
      });
      if (!res.ok) throw new Error();
      setReviewState("done");
      setReviewName("");
      setReviewComment("");
      setReviewRating(5);
    } catch {
      setReviewState("error");
      setTimeout(() => setReviewState("idle"), 3000);
    }
  }

  return (
    <div>
      {/* Qty + CTA */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "40px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--line)", gap: 0 }}>
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            style={{ width: "44px", height: "50px", background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            −
          </button>
          <span style={{ width: "32px", textAlign: "center", fontSize: "14px", color: "var(--ink)" }}>{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            style={{ width: "44px", height: "50px", background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            +
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          style={{
            background: added ? "var(--gold)" : "var(--ink)",
            color: "white",
            padding: "14px 28px",
            fontSize: "11px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontFamily: "var(--font-body)",
            fontWeight: 400,
            border: "none",
            cursor: "pointer",
            transition: "background 0.25s",
            flex: 1,
          }}
          onMouseEnter={(e) => { if (!added) e.currentTarget.style.background = "var(--gold)"; }}
          onMouseLeave={(e) => { if (!added) e.currentTarget.style.background = added ? "var(--gold)" : "var(--ink)"; }}
        >
          {added ? "Добавлено ✓" : "В корзину"}
        </button>

        <WishlistButton
          item={{ slug, title, price: priceFormatted, image, alt }}
          size="md"
        />

        <Link
          href={"/contacts" as never}
          style={{
            padding: "14px 20px",
            fontSize: "11px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontFamily: "var(--font-body)",
            border: "1px solid var(--ink)",
            color: "var(--ink)",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            whiteSpace: "nowrap",
          }}
        >
          Задать вопрос
        </Link>
      </div>

      {/* Tabs */}
      <div>
        <div style={{ display: "flex", flexWrap: "wrap", borderBottom: "1px solid var(--line)", marginBottom: "28px", gap: "0" }}>
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                background: "none",
                border: "none",
                borderBottom: t === tab ? "2px solid var(--gold)" : "2px solid transparent",
                padding: "10px 20px 10px 0",
                marginBottom: "-1px",
                fontSize: "11px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: t === tab ? "var(--gold)" : "var(--mid)",
                cursor: "pointer",
                transition: "color 0.2s",
                fontFamily: "var(--font-body)",
              }}
            >
              {t}
              {t === "Отзывы" && ratingCount != null && ratingCount > 0 && (
                <span style={{ marginLeft: "6px", fontSize: "10px", color: "var(--gold)", opacity: 0.8 }}>
                  ({ratingCount})
                </span>
              )}
            </button>
          ))}
        </div>

        {tab === "Описание" && (
          <div style={{ color: "var(--mid)", lineHeight: 1.9, fontSize: "14px" }}>
            <p style={{ marginBottom: "16px" }}>
              {description || "Каждый предмет создаётся вручную и проходит контроль качества перед отправкой. Массив дуба выдерживается минимум 3 года перед обработкой — это гарантирует стабильность формы и глубину текстуры."}
            </p>
            <p>Металлические элементы куются вручную и покрываются матовым воском для защиты от окисления. Каждое соединение проверяется мастером.</p>
          </div>
        )}

        {tab === "Характеристики" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {specs.map((s, i) => (
              <div
                key={s.key}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  padding: "12px 0",
                  borderBottom: "1px solid var(--line)",
                  borderTop: i === 0 ? "1px solid var(--line)" : "none",
                  gap: "16px",
                }}
              >
                <span style={{ fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--mid)" }}>{s.key}</span>
                <span style={{ fontSize: "14px", color: "var(--ink)" }}>{s.value}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "Отзывы" && (
          <div>
            {/* Summary */}
            {ratingAvg != null && ratingCount != null && ratingCount > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "40px", fontWeight: 300 }}>{ratingAvg.toFixed(1)}</span>
                <div>
                  <div style={{ display: "flex", gap: "2px", marginBottom: "4px" }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} style={{ fontSize: "14px", color: star <= Math.round(ratingAvg) ? "var(--gold)" : "var(--line)" }}>★</span>
                    ))}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--mid)", letterSpacing: "0.1em" }}>{ratingCount} {ratingCount === 1 ? "отзыв" : ratingCount < 5 ? "отзыва" : "отзывов"}</div>
                </div>
              </div>
            )}

            {/* Review list */}
            {reviews.length === 0 ? (
              <p style={{ color: "var(--mid)", fontSize: "14px", marginBottom: "32px" }}>Отзывов пока нет. Будьте первым!</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "40px" }}>
                {reviews.map((r, i) => (
                  <div key={i} style={{ borderLeft: "2px solid var(--gold-pale)", paddingLeft: "16px" }}>
                    <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} style={{ fontSize: "12px", color: star <= r.rating ? "var(--gold)" : "var(--line)" }}>★</span>
                      ))}
                    </div>
                    {(r as Review & { authorName?: string }).authorName && (
                      <div style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--mid)", marginBottom: "4px" }}>
                        {(r as Review & { authorName?: string }).authorName}
                      </div>
                    )}
                    <p style={{ fontSize: "14px", color: "var(--ink)", lineHeight: 1.7, marginBottom: "6px" }}>{r.comment ?? "—"}</p>
                    <span style={{ fontSize: "11px", color: "var(--mid)" }}>
                      {new Date(r.createdAt).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Review form */}
            <div style={{ borderTop: "1px solid var(--line)", paddingTop: "28px" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "20px" }}>
                Оставить отзыв
              </div>

              {reviewState === "done" ? (
                <div style={{ padding: "16px 20px", background: "var(--gold-pale)", color: "var(--gold)", fontSize: "13px", letterSpacing: "0.05em" }}>
                  Спасибо! Ваш отзыв отправлен.
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {/* Star picker */}
                  <div style={{ display: "flex", gap: "4px" }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        onMouseEnter={() => setReviewHover(star)}
                        onMouseLeave={() => setReviewHover(0)}
                        style={{ background: "none", border: "none", cursor: "pointer", fontSize: "22px", color: star <= (reviewHover || reviewRating) ? "var(--gold)" : "var(--line)", padding: "0 2px", transition: "color 0.15s" }}
                      >★</button>
                    ))}
                  </div>

                  {/* Name */}
                  <input
                    type="text"
                    placeholder="Ваше имя *"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    required
                    style={{ border: "1px solid var(--line)", padding: "10px 14px", fontSize: "13px", fontFamily: "var(--font-body)", background: "white", outline: "none", color: "var(--ink)", width: "100%" }}
                  />

                  {/* Comment */}
                  <textarea
                    placeholder="Ваш отзыв (необязательно)"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={3}
                    style={{ border: "1px solid var(--line)", padding: "10px 14px", fontSize: "13px", fontFamily: "var(--font-body)", background: "white", outline: "none", resize: "vertical", color: "var(--ink)", width: "100%" }}
                  />

                  <button
                    type="submit"
                    disabled={reviewState === "sending"}
                    style={{ alignSelf: "flex-start", background: reviewState === "error" ? "#c0392b" : "var(--ink)", color: "white", padding: "11px 28px", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "var(--font-body)", border: "none", cursor: reviewState === "sending" ? "wait" : "pointer", opacity: reviewState === "sending" ? 0.7 : 1 }}
                  >
                    {reviewState === "sending" ? "Отправка…" : reviewState === "error" ? "Ошибка, повторить" : "Отправить"}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function ProductThumbnails({ image, alt }: { image: string; alt: string }) {
  return (
    <div style={{ display: "flex", gap: "12px" }}>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          style={{ width: "72px", height: "72px", background: "var(--warm-gray)", border: "1px solid var(--line)", flexShrink: 0 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
      ))}
    </div>
  );
}
