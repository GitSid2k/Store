import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const p = await prisma.product.findUnique({
    where: { id: params.id },
    include: { images: { take: 1 }, category: { select: { slug: true } } },
  });
  if (!p) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(p);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json() as {
      name?: string; description?: string; price?: number;
      status?: string; imageUrl?: string; specs?: Record<string, unknown>;
    };

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...(body.name ? { name: body.name } : {}),
        ...(body.description !== undefined ? { description: body.description } : {}),
        ...(body.price ? { price: body.price } : {}),
        ...(body.status ? { status: body.status } : {}),
        ...(body.specs ? { specs: JSON.stringify(body.specs) } : {}),
      },
    });

    if (body.imageUrl) {
      await prisma.productImage.deleteMany({ where: { productId: params.id } });
      await prisma.productImage.create({ data: { url: body.imageUrl, alt: body.name ?? product.name, productId: params.id, order: 0 } });
    }

    return NextResponse.json({ id: product.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Not found or error" }, { status: 404 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
