import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"]),
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { status } = schema.parse(body);
    const order = await prisma.order.update({
      where: { id: params.id },
      data: { status },
    });
    return NextResponse.json(order);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 400 });
  }
}
