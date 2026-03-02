import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { resend } from "@/lib/resend";
import OrderConfirmationEmail from "@/emails/order-confirmation";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return new NextResponse("Webhook Secret or Signature missing", { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const session = event.data.object as any;

  if (event.type === "checkout.session.completed") {
    const orderId = session?.metadata?.orderId;

    if (orderId) {
      const order = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "CONFIRMED", // Update order status on successful payment
        },
      });

      // Send email
      if (order.guestEmail && order.guestName) {
        try {
          await resend.emails.send({
            from: 'Dub & Stal <orders@dubstal.ru>',
            to: order.guestEmail,
            subject: `Заказ #${order.id.slice(-8).toUpperCase()} подтвержден`,
            react: OrderConfirmationEmail({
              orderId: order.id,
              customerName: order.guestName,
              total: order.total,
            }),
          });
        } catch (error) {
          console.error("Error sending email:", error);
        }
      }
    }
  }

  return new NextResponse(null, { status: 200 });
}
