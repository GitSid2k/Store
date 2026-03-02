import { prisma } from "@/lib/prisma";

export type ProductBadge = "Новинка" | "Хит" | "Под заказ" | "-20%" | string;

export type ProductCard = {
  slug: string;
  title: string;
  subtitle: string;
  price: string;
  badge: ProductBadge;
  image: string;
  alt: string;
};

export const FALLBACK_IMG = "https://images.unsplash.com/photo-1631160741311-deaa00996a22?auto=format&fit=crop&w=1200&q=80";

export function formatPrice(amount: number, currency = "RUB") {
  return new Intl.NumberFormat("ru-RU", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
}

export async function getFeaturedProducts(): Promise<ProductCard[]> {
  const items = await prisma.product.findMany({
    take: 12,
    include: { images: { take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  return items.map((p) => ({
    slug: p.slug,
    title: p.name,
    subtitle: p.description ?? "", 
    price: formatPrice(p.price),
    badge: p.status,
    image: p.images[0]?.url ?? FALLBACK_IMG,
    alt: p.images[0]?.alt ?? p.name,
  }));
}

export async function getProductBySlug(slug: string): Promise<ProductCard | null> {
  const p = await prisma.product.findUnique({
    where: { slug },
    include: { images: { take: 1 } },
  });
  if (!p) return null;
  return {
    slug: p.slug,
    title: p.name,
    subtitle: p.description ?? "",
    price: formatPrice(p.price),
    badge: p.status,
    image: p.images[0]?.url ?? FALLBACK_IMG,
    alt: p.images[0]?.alt ?? p.name,
  };
}
