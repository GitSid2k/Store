import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "dub-stal-secret-dev-key-change-in-prod"
);
const COOKIE = "ds_session";

async function getUserId(req: Request): Promise<string | null> {
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) return null;
  
  const cookies = cookieHeader.split(";").reduce((acc: Record<string, string>, cookie) => {
    const [key, value] = cookie.trim().split("=");
    if (key && value) acc[key] = value;
    return acc;
  }, {} as Record<string, string>);
  
  const token = cookies[COOKIE];
  if (!token) return null;
  
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload.userId as string;
  } catch {
    return null;
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const wishlistItem = await prisma.wishlist.deleteMany({
      where: {
        userId: user.id,
        productId: params.productId
      }
    });

    if (wishlistItem.count === 0) {
      return NextResponse.json({ error: "Item not found in wishlist" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to remove from wishlist:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
