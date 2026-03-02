"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useWishlist } from "@/store/wishlist";

type Me = { name: string; email: string } | null;

export function NavAuth() {
  const router = useRouter();
  const [me, setMe] = useState<Me>(undefined as unknown as Me);
  const wishlistCount = useWishlist((s) => s.items.length);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setMe(d as Me))
      .catch(() => setMe(null));
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setMe(null);
    router.push("/");
    router.refresh();
  }

  if (me === undefined) return null;

  if (!me) {
    return (
      <Link
        href={"/login" as never}
        className="hover-gold-link"
        style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--mid)", textDecoration: "none" }}
      >
        Войти
      </Link>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
      {/* Wishlist link */}
      <Link
        href={"/account/wishlist" as never}
        className="hover-gold-link"
        title="Избранное"
        style={{ position: "relative", fontSize: "16px", color: "var(--mid)", textDecoration: "none", display: "flex", alignItems: "center" }}
      >
        ♡
        {wishlistCount > 0 && (
          <span style={{
            position: "absolute",
            top: "-6px",
            right: "-8px",
            background: "var(--gold)",
            color: "white",
            fontSize: "9px",
            lineHeight: 1,
            padding: "2px 4px",
            borderRadius: "8px",
            minWidth: "14px",
            textAlign: "center",
          }}>
            {wishlistCount}
          </span>
        )}
      </Link>

      <Link
        href={"/account/orders" as never}
        className="hover-gold-link"
        style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--mid)", textDecoration: "none" }}
      >
        {me.name}
      </Link>
      <button
        onClick={handleLogout}
        style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--mid)", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-body)", padding: 0 }}
        className="hover-gold-link"
      >
        Выйти
      </button>
    </div>
  );
}
