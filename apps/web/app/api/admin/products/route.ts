import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json() as {
      name: string; slug: string; description: string;
      price: number; status: string; category: string;
      imageUrl: string; specs: Record<string, unknown>;
    };

    const category = await prisma.category.upsert({
      where: { slug: body.category },
      update: {},
      create: { slug: body.category, name: body.category },
    });

    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        price: body.price,
        status: body.status,
        categoryId: category.id,
        specs: JSON.stringify(body.specs),
        ...(body.imageUrl
          ? { images: { create: [{ url: body.imageUrl, alt: body.name, order: 0 }] } }
          : {}),
      },
    });

    return NextResponse.json({ id: product.id }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
