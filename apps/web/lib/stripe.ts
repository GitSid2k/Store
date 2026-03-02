import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    stripeInstance = new Stripe(key, {
      apiVersion: "2024-11-20.acacia" as any,
      appInfo: {
        name: "Wood & Metal Shop",
        url: "https://dubstal.ru",
      },
    });
  }
  return stripeInstance;
}

// Export a proxy that lazily initializes Stripe
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return getStripe()[prop as keyof Stripe];
  },
});
