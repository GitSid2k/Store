import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
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

export async function POST(req: Request) {
  try {
    const body = await req.json() as {
      name: string;
      email: string;
      phone: string;
      address: string;
      total: number;
      items: { slug: string; title: string; image?: string; qty: number; price: number }[];
    };

    if (!body.phone?.trim()) {
      return NextResponse.json({ error: "Phone number required" }, { status: 400 });
    }

    // Get authenticated user
    const userId = await getUserId(req);
    let user = null;
    
    if (userId) {
      user = await prisma.user.findUnique({
        where: { id: userId }
      });
    }

    const products = await prisma.product.findMany({
      where: { slug: { in: body.items.map((i) => i.slug) } },
      select: { id: true, slug: true, name: true },
    });
    const slugToProduct = new Map(products.map((p) => [p.slug, p]));

    const orderData: any = {
      total: body.total,
      status: "PENDING",
      items: {
        create: body.items
          .filter((i) => slugToProduct.has(i.slug))
          .map((i) => ({
            productId: slugToProduct.get(i.slug)!.id,
            qty: i.qty,
            price: i.price,
          })),
      },
    };

    if (user) {
      orderData.userId = user.id;
    } else {
      orderData.guestName = body.name;
      orderData.guestEmail = body.email;
    }

    orderData.contactPhone = body.phone;

    const order = await prisma.order.create({
      data: orderData,
    });

    // Create Stripe Checkout Session
    const origin = headers().get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: user?.email || body.email,
      line_items: body.items.map((item) => ({
        price_data: {
          currency: "rub",
          product_data: {
            name: item.title,
            images: item.image ? [item.image.startsWith('http') ? item.image : `${origin}${item.image}`] : [],
          },
          unit_amount: item.price * 100, // Stripe expects amount in smallest currency unit (kopecks)
        },
        quantity: item.qty,
      })),
      metadata: {
        orderId: order.id,
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
    });

    return NextResponse.json({ id: order.id, url: session.url }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    // Get authenticated user
    const userId = await getUserId(req);
    let user = null;
    
    if (userId) {
      user = await prisma.user.findUnique({
        where: { id: userId }
      });
    }

    const orders = await prisma.order.findMany({
      where: user ? { userId: user.id } : { userId: null },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        items: {
          include: { product: { select: { name: true, slug: true } } },
        },
      },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
