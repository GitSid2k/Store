"use client";

import { useWishlist } from "@/store/wishlist";
import type { WishlistItem } from "@/store/wishlist";

type Props = {
  item: WishlistItem;
  size?: "sm" | "md";
};

export function WishlistButton({ item, size = "md" }: Props) {
  const { toggle, has } = useWishlist();
  const saved = has(item.slug);
  const dim = size === "sm" ? "32px" : "44px";
  const fontSize = size === "sm" ? "14px" : "18px";

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(item);
      }}
      title={saved ? "Убрать из избранного" : "В избранное"}
      style={{
        width: dim,
        height: dim,
        border: `1px solid ${saved ? "var(--gold)" : "var(--line)"}`,
        background: saved ? "var(--gold-pale)" : "white",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize,
        color: saved ? "var(--gold)" : "var(--mid)",
        transition: "all 0.2s",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--gold)";
        e.currentTarget.style.color = "var(--gold)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = saved ? "var(--gold)" : "var(--line)";
        e.currentTarget.style.color = saved ? "var(--gold)" : "var(--mid)";
      }}
    >
      {saved ? "♥" : "♡"}
    </button>
  );
}
