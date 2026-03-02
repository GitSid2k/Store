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

export async function GET(req: Request) {
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

    const wishlist = await prisma.wishlist.findMany({
      where: { userId: user.id },
      include: {
        product: {
          include: {
            images: {
              orderBy: { order: "asc" },
              take: 1
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(wishlist);
  } catch (error) {
    console.error("Failed to fetch wishlist:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
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

    const body = await req.json() as { productId: string };

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: body.productId }
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check if already in wishlist
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: body.productId
        }
      }
    });

    if (existing) {
      return NextResponse.json({ error: "Already in wishlist" }, { status: 409 });
    }

    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId: user.id,
        productId: body.productId
      },
      include: {
        product: {
          include: {
            images: {
              orderBy: { order: "asc" },
              take: 1
            }
          }
        }
      }
    });

    return NextResponse.json(wishlistItem, { status: 201 });
  } catch (error) {
    console.error("Failed to add to wishlist:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
