import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  productSlug: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
  authorName: z.string().min(1).max(80).default("Аноним"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const product = await prisma.product.findUnique({ where: { slug: data.productSlug }, select: { id: true } });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    await prisma.review.create({
      data: {
        productId: product.id,
        rating: data.rating,
        comment: data.comment ?? null,
        authorName: data.authorName,
      },
    });

    const agg = await prisma.review.aggregate({
      where: { productId: product.id },
      _avg: { rating: true },
      _count: { rating: true },
    });
    await prisma.product.update({
      where: { id: product.id },
      data: { ratingAvg: agg._avg.rating ?? 0, ratingCount: agg._count.rating },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 400 });
  }
}
