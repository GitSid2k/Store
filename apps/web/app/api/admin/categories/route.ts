import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const cats = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(cats);
}

export async function POST(req: Request) {
  const body = await req.json() as { name: string; slug: string };
  const cat = await prisma.category.upsert({
    where: { slug: body.slug },
    update: { name: body.name },
    create: { slug: body.slug, name: body.name },
  });
  return NextResponse.json(cat, { status: 201 });
}
