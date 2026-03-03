"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface WishlistItem {
  id: string;
  productId: string;
  createdAt: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: {
      url: string;
      alt: string;
    }[];
  };
}

export function Wishlist() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await fetch("/api/wishlist");
        if (response.status === 401) {
          setUnauthorized(true);
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to load wishlist");
        }

        const data = await response.json();
        setWishlist(data);
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
        setError("Не удалось загрузить избранное. Попробуйте позже.");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const removeFromWishlist = async (productId: string) => {
    setRemoving(productId);
    try {
      const response = await fetch(`/api/wishlist/${productId}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        setWishlist(prev => prev.filter(item => item.productId !== productId));
      }
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
    } finally {
      setRemoving(null);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "40px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ border: "1px solid var(--line)", borderRadius: "8px", padding: "16px" }}>
              <div style={{ height: "200px", background: "var(--line)", borderRadius: "4px", marginBottom: "16px" }} />
              <div style={{ height: "20px", background: "var(--line)", borderRadius: "4px", marginBottom: "8px" }} />
              <div style={{ height: "20px", background: "var(--line)", borderRadius: "4px", width: "60%" }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div style={{ padding: "40px 0", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "18px", letterSpacing: "0.05em", marginBottom: "16px", color: "var(--dark)" }}>
          Войдите, чтобы увидеть избранное
        </h2>
        <p style={{ color: "var(--mid)", marginBottom: "32px" }}>
          Мы привязываем список желаемого к вашему аккаунту.
        </p>
        <Link
          href="/login"
          className="button-primary"
          style={{ display: "inline-block", padding: "12px 32px", background: "var(--dark)", color: "white", textDecoration: "none", borderRadius: "4px", fontSize: "13px", letterSpacing: "0.02em" }}
        >
          Войти
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "40px 0", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "18px", letterSpacing: "0.05em", marginBottom: "16px", color: "var(--dark)" }}>
          Ошибка загрузки
        </h2>
        <p style={{ color: "var(--mid)", marginBottom: "32px" }}>{error}</p>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div style={{ padding: "40px 0", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "18px", letterSpacing: "0.05em", marginBottom: "16px", color: "var(--dark)" }}>
          Ваш список желаний пуст
        </h2>
        <p style={{ color: "var(--mid)", marginBottom: "32px" }}>
          Сохраняйте понравившиеся товары, чтобы не потерять их
        </p>
        <Link
          href="/catalog"
          className="button-primary"
          style={{ display: "inline-block", padding: "12px 32px", background: "var(--dark)", color: "white", textDecoration: "none", borderRadius: "4px", fontSize: "13px", letterSpacing: "0.02em" }}
        >
          Перейти в каталог
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px 0" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "24px", letterSpacing: "0.05em", marginBottom: "40px", color: "var(--dark)" }}>
        Избранное ({wishlist.length})
      </h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
        {wishlist.map((item) => (
          <div key={item.id} style={{ border: "1px solid var(--line)", borderRadius: "8px", overflow: "hidden", background: "white" }}>
            {/* Product Image */}
            <div style={{ position: "relative", height: "200px", background: "var(--line)" }}>
              {item.product.images[0] && (
                <Image
                  src={item.product.images[0].url}
                  alt={item.product.images[0].alt || item.product.name}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              )}
              
              {/* Remove Button */}
              <button
                onClick={() => removeFromWishlist(item.productId)}
                disabled={removing === item.productId}
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "white",
                  border: "1px solid var(--line)",
                  cursor: removing === item.productId ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (removing !== item.productId) {
                    e.currentTarget.style.background = "var(--dark)";
                    e.currentTarget.style.color = "white";
                  }
                }}
                onMouseLeave={(e) => {
                  if (removing !== item.productId) {
                    e.currentTarget.style.background = "white";
                    e.currentTarget.style.color = "var(--dark)";
                  }
                }}
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                </svg>
              </button>
            </div>

            {/* Product Info */}
            <div style={{ padding: "20px" }}>
              <Link
                href={`/product/${item.product.slug}`}
                style={{ 
                  textDecoration: "none", 
                  color: "var(--dark)",
                  display: "block",
                  marginBottom: "12px"
                }}
                className="hover-gold-link"
              >
                <h3 style={{ 
                  fontSize: "14px", 
                  fontWeight: "400", 
                  lineHeight: "1.4",
                  margin: 0,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden"
                }}>
                  {item.product.name}
                </h3>
              </Link>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: "16px", fontWeight: "500", color: "var(--dark)" }}>
                  {new Intl.NumberFormat("ru-RU", {
                    style: "currency",
                    currency: "RUB",
                    minimumFractionDigits: 0,
                  }).format(item.product.price)}
                </div>

                <Link
                  href={`/product/${item.product.slug}`}
                  className="button-secondary"
                  style={{
                    padding: "8px 16px",
                    fontSize: "12px",
                    border: "1px solid var(--dark)",
                    color: "var(--dark)",
                    textDecoration: "none",
                    borderRadius: "4px",
                    transition: "all 0.2s",
                  }}
                >
                  Подробнее
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
