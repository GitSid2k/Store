"use client";

import { useWishlist } from "@/store/wishlist";
import type { WishlistItem } from "@/store/wishlist";
import { useEffect, useState } from "react";

type Props = {
  item: WishlistItem;
  size?: "sm" | "md";
};

export function WishlistButton({ item, size = "md" }: Props) {
  const { toggle, has } = useWishlist();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const dim = size === "sm" ? "32px" : "44px";
  const fontSize = size === "sm" ? "14px" : "18px";

  useEffect(() => {
    setMounted(true);
  }, []);

  const saved = mounted ? has(item.slug) : false;

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (loading) return;
    
    setLoading(true);
    
    try {
      // Сначала обновляем локальный store для мгновенного UI
      toggle(item);
      
      // Затем синхронизируем с API
      const response = await fetch(saved ? `/api/wishlist/${item.id}` : '/api/wishlist', {
        method: saved ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        ...(saved ? {} : { body: JSON.stringify({ productId: item.id }) }),
      });
      
      if (!response.ok) {
        // Если API запрос failed, откатываем локальное состояние
        toggle(item);
        console.error('Failed to sync wishlist with API');
      }
    } catch (error) {
      // Откатываем локальное состояние при ошибке
      toggle(item);
      console.error('Wishlist sync error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      title={saved ? "Убрать из избранного" : "В избранное"}
      style={{
        width: dim,
        height: dim,
        border: `1px solid ${saved ? "var(--gold)" : "var(--line)"}`,
        background: saved ? "var(--gold-pale)" : "white",
        cursor: loading ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize,
        color: saved ? "var(--gold)" : "var(--mid)",
        transition: "all 0.2s",
        flexShrink: 0,
        opacity: loading ? 0.6 : 1,
      }}
      onMouseEnter={(e) => {
        if (!loading) {
          e.currentTarget.style.borderColor = "var(--gold)";
          e.currentTarget.style.color = "var(--gold)";
        }
      }}
      onMouseLeave={(e) => {
        if (!loading) {
          e.currentTarget.style.borderColor = saved ? "var(--gold)" : "var(--line)";
          e.currentTarget.style.color = saved ? "var(--gold)" : "var(--mid)";
        }
      }}
    >
      {loading ? "…" : (saved ? "♥" : "♡")}
    </button>
  );
}
