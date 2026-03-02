"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import Link from "next/link";

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  items: {
    id: string;
    qty: number;
    price: number;
    product: {
      name: string;
      slug: string;
    };
  }[];
}

export function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders");
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "40px 0" }}>
        <div style={{ display: "grid", gap: "24px" }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ border: "1px solid var(--line)", borderRadius: "8px", padding: "24px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                <div style={{ height: "20px", background: "var(--line)", borderRadius: "4px" }} />
                <div style={{ height: "20px", background: "var(--line)", borderRadius: "4px" }} />
                <div style={{ height: "20px", background: "var(--line)", borderRadius: "4px" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div style={{ padding: "40px 0", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "18px", letterSpacing: "0.05em", marginBottom: "16px", color: "var(--dark)" }}>
          У вас пока нет заказов
        </h2>
        <p style={{ color: "var(--mid)", marginBottom: "32px" }}>
          Когда вы сделаете первый заказ, он появится здесь
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "#F59E0B";
      case "PROCESSING":
        return "#3B82F6";
      case "SHIPPED":
        return "#8B5CF6";
      case "DELIVERED":
        return "#10B981";
      case "CANCELLED":
        return "#EF4444";
      default:
        return "var(--mid)";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Ожидает оплаты";
      case "PROCESSING":
        return "В обработке";
      case "SHIPPED":
        return "Отправлен";
      case "DELIVERED":
        return "Доставлен";
      case "CANCELLED":
        return "Отменён";
      default:
        return status;
    }
  };

  return (
    <div style={{ padding: "40px 0" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "24px", letterSpacing: "0.05em", marginBottom: "40px", color: "var(--dark)" }}>
        История заказов
      </h1>
      
      <div style={{ display: "grid", gap: "24px" }}>
        {orders.map((order) => (
          <div key={order.id} style={{ border: "1px solid var(--line)", borderRadius: "8px", padding: "24px", background: "white" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <div style={{ fontSize: "13px", color: "var(--mid)", marginBottom: "4px" }}>
                  Заказ №{order.id.slice(-8).toUpperCase()}
                </div>
                <div style={{ fontSize: "14px", color: "var(--dark)" }}>
                  {format(new Date(order.createdAt), "d MMMM yyyy 'в' HH:mm", { locale: ru })}
                </div>
              </div>
              
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ 
                  padding: "4px 12px", 
                  borderRadius: "12px", 
                  fontSize: "12px", 
                  fontWeight: "500",
                  background: `${getStatusColor(order.status)}15`,
                  color: getStatusColor(order.status)
                }}>
                  {getStatusText(order.status)}
                </div>
                <div style={{ fontSize: "16px", fontWeight: "500", color: "var(--dark)" }}>
                  {new Intl.NumberFormat("ru-RU", {
                    style: "currency",
                    currency: "RUB",
                    minimumFractionDigits: 0,
                  }).format(order.total)}
                </div>
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--line)", paddingTop: "20px" }}>
              <div style={{ fontSize: "13px", color: "var(--mid)", marginBottom: "12px" }}>
                Товары ({order.items.length})
              </div>
              <div style={{ display: "grid", gap: "12px" }}>
                {order.items.map((item) => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ 
                        width: "40px", 
                        height: "40px", 
                        background: "var(--line)", 
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "10px",
                        color: "var(--mid)"
                      }}>
                        {/* Product image placeholder */}
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 7a2 2 0 114 0 2 2 0 01-4 0z"/>
                        </svg>
                      </div>
                      <div>
                        <Link
                          href={`/product/${item.product.slug}`}
                          style={{ 
                            fontSize: "14px", 
                            color: "var(--dark)", 
                            textDecoration: "none",
                            fontWeight: "400"
                          }}
                          className="hover-gold-link"
                        >
                          {item.product.name}
                        </Link>
                        <div style={{ fontSize: "12px", color: "var(--mid)", marginTop: "2px" }}>
                          Количество: {item.qty}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: "14px", color: "var(--dark)" }}>
                      {new Intl.NumberFormat("ru-RU", {
                        style: "currency",
                        currency: "RUB",
                        minimumFractionDigits: 0,
                      }).format(item.price * item.qty)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {order.status === "DELIVERED" && (
              <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid var(--line)" }}>
                <Link
                  href={`/product/${order.items[0]?.product.slug}#reviews`}
                  className="button-secondary"
                  style={{ 
                    display: "inline-block", 
                    padding: "8px 20px", 
                    border: "1px solid var(--dark)", 
                    color: "var(--dark)", 
                    textDecoration: "none", 
                    borderRadius: "4px", 
                    fontSize: "12px", 
                    letterSpacing: "0.02em",
                    transition: "all 0.2s"
                  }}
                >
                  Оставить отзыв
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
