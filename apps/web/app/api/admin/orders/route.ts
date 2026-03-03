import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      items: {
        include: { product: { select: { name: true } } },
      },
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      _count: false,
    },
  });
  return NextResponse.json(orders);
}
