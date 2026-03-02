"use client";

import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/products";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Ожидает",
  CONFIRMED: "Подтверждён",
  SHIPPED: "Отправлен",
  DELIVERED: "Доставлен",
  CANCELLED: "Отменён",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#fbbf24",
  CONFIRMED: "#60a5fa",
  SHIPPED: "#a78bfa",
  DELIVERED: "#4ade80",
  CANCELLED: "#f87171",
};

type OrderItem = { id: string; qty: number; product: { name: string } };
type Order = { id: string; status: string; guestName: string | null; guestEmail: string | null; total: number; createdAt: string; items: OrderItem[] };

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(id: string, status: string) {
    setUpdating(id);
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
    setUpdating(null);
  }

  if (loading) return <div style={{ color: "rgba(138,128,112,0.5)", fontSize: "14px" }}>Загрузка...</div>;

  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 300, color: "#FAFAF7", marginBottom: "32px" }}>
        Заказы <span style={{ color: "rgba(138,128,112,0.5)", fontSize: "18px" }}>({orders.length})</span>
      </h1>

      {orders.length === 0 ? (
        <div style={{ color: "rgba(138,128,112,0.5)", fontSize: "14px", padding: "40px 0" }}>Заказов пока нет</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {orders.map((order) => (
            <div key={order.id} style={{ border: "1px solid rgba(216,210,196,0.12)", padding: "20px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px", gap: "16px" }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: "13px", color: "#FAFAF7", marginBottom: "4px" }}>
                    #{order.id.slice(-8).toUpperCase()} · {order.guestName ?? "Покупатель"}
                  </div>
                  <div style={{ fontSize: "12px", color: "rgba(138,128,112,0.6)" }}>
                    {order.guestEmail} · {new Date(order.createdAt).toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
                  <select
                    value={order.status}
                    disabled={updating === order.id}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    style={{ fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: STATUS_COLORS[order.status] ?? "#FAFAF7", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(216,210,196,0.2)", padding: "4px 8px", cursor: "pointer", outline: "none", fontFamily: "var(--font-body)", opacity: updating === order.id ? 0.5 : 1 }}
                  >
                    {Object.entries(STATUS_LABELS).map(([val, label]) => (
                      <option key={val} value={val} style={{ background: "#1A1814", color: "#FAFAF7" }}>{label}</option>
                    ))}
                  </select>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "18px", color: "#9A7A3A" }}>
                    {formatPrice(order.total)}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {order.items.map((item) => (
                  <span key={item.id} style={{ fontSize: "12px", color: "rgba(138,128,112,0.7)", background: "rgba(255,255,255,0.04)", padding: "4px 10px", border: "1px solid rgba(216,210,196,0.08)" }}>
                    {item.product.name} × {item.qty}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
