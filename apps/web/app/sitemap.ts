import type { MetadataRoute } from "next";
import { createCaller } from "@/lib/trpc/server";

const BASE = "https://dubstal.ru";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const caller = await createCaller();
  const products = await caller.products.list();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/catalog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/collections`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/contacts`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    ...["living", "dining", "bedroom", "lighting", "storage"].map((slug) => ({
      url: `${BASE}/collections/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE}/product/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
