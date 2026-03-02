import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { AdminProductList } from "@/components/admin/product-list";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { name: true } },
      images: { take: 1 },
    },
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 300, color: "#FAFAF7" }}>Товары</h1>
        <Link href={"/admin/products/new" as never} style={{ background: "#9A7A3A", color: "white", padding: "10px 20px", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none" }}>
          + Добавить товар
        </Link>
      </div>
      <AdminProductList initialProducts={products} />
    </div>
  );
}
