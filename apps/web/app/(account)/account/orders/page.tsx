import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/products";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Ожидает",
  CONFIRMED: "Подтверждён",
  SHIPPED: "Отправлен",
  DELIVERED: "Доставлен",
  CANCELLED: "Отменён",
};

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      items: {
        include: { product: { select: { name: true, slug: true } } },
      },
    },
  });

  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 300, lineHeight: 1.1, marginBottom: "40px" }}>
        История заказов
      </h1>

      {orders.length === 0 ? (
        <div style={{ padding: "60px 0", color: "var(--mid)", fontSize: "15px", lineHeight: 1.8 }}>
          У вас пока нет заказов.{" "}
          <a href="/catalog" style={{ color: "var(--gold)", textDecoration: "none", borderBottom: "1px solid var(--gold)", paddingBottom: "1px" }}>
            Перейти в каталог →
          </a>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {orders.map((order) => (
            <div key={order.id} style={{ border: "1px solid var(--line)", padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                <div>
                  <div style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--mid)", marginBottom: "4px" }}>
                    Заказ #{order.id.slice(-8).toUpperCase()}
                  </div>
                  <div style={{ fontSize: "13px", color: "var(--mid)" }}>
                    {new Date(order.createdAt).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
                  </div>
                  {order.guestName && (
                    <div style={{ fontSize: "13px", color: "var(--mid)", marginTop: "2px" }}>{order.guestName} · {order.guestEmail}</div>
                  )}
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ display: "inline-block", background: "var(--gold-pale)", color: "var(--gold)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", padding: "4px 12px", marginBottom: "8px" }}>
                    {STATUS_LABELS[order.status] ?? order.status}
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 400 }}>{formatPrice(order.total)}</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {order.items.map((item) => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "var(--mid)" }}>
                    <span>{item.product.name} × {item.qty}</span>
                    <span>{formatPrice(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
