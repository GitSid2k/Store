import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json(null);
  return NextResponse.json({ userId: session.userId, name: session.name, email: session.email });
}

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json() as {
      name: string;
    };

    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: { name: body.name },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Failed to update user profile:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
