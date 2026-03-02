import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  const [products, categories, orders] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.count(),
  ]);

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  const stats = [
    { label: "Товаров", value: products, href: "/admin/products" },
    { label: "Категорий", value: categories, href: "/admin/categories" },
    { label: "Заказов", value: orders, href: "/admin/orders" },
  ];

  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "32px", fontWeight: 300, color: "#FAFAF7", marginBottom: "40px" }}>
        Дашборд
      </h1>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", marginBottom: "48px" }}>
        {stats.map((s) => (
          <Link key={s.label} href={s.href as never} style={{ textDecoration: "none" }}>
            <div style={{ border: "1px solid rgba(216,210,196,0.15)", padding: "28px 32px", transition: "border-color 0.2s", cursor: "pointer" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "48px", fontWeight: 300, color: "#9A7A3A", lineHeight: 1, marginBottom: "8px" }}>{s.value}</div>
              <div style={{ fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(138,128,112,0.7)" }}>{s.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "48px" }}>
        <Link href={"/admin/products/new" as never} style={{ background: "#9A7A3A", color: "white", padding: "12px 24px", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none", display: "inline-block" }}>
          + Новый товар
        </Link>
        <Link href={"/admin/categories" as never} style={{ border: "1px solid rgba(216,210,196,0.3)", color: "rgba(250,250,247,0.7)", padding: "12px 24px", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none", display: "inline-block" }}>
          + Категория
        </Link>
      </div>

      {/* Recent orders */}
      <div>
        <div style={{ fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(138,128,112,0.7)", marginBottom: "16px" }}>Последние заказы</div>
        {recentOrders.length === 0 ? (
          <div style={{ color: "rgba(138,128,112,0.5)", fontSize: "14px" }}>Заказов пока нет</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {recentOrders.map((o) => (
              <div key={o.id} style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px", border: "1px solid rgba(216,210,196,0.1)", fontSize: "13px", color: "rgba(250,250,247,0.7)" }}>
                <span>#{o.id.slice(-8).toUpperCase()} · {o.guestName ?? "—"}</span>
                <span style={{ color: "#9A7A3A" }}>{new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(o.total)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
