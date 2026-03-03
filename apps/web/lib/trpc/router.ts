import { publicProcedure, router } from "@/lib/trpc/trpc";
import { formatPrice, FALLBACK_IMG } from "@/lib/products";
import { z } from "zod";

const productCardSelect = {
  id: true,
  slug: true,
  name: true,
  description: true,
  price: true,
  status: true,
  specs: true,
  ratingAvg: true,
  ratingCount: true,
  images: { select: { url: true, alt: true }, take: 1 },
  reviews: { select: { rating: true, comment: true, createdAt: true }, take: 3, orderBy: { createdAt: "desc" } },
} as const;

export const appRouter = router({
  reviews: router({
    create: publicProcedure
      .input(
        z.object({
          productSlug: z.string(),
          rating: z.number().int().min(1).max(5),
          comment: z.string().max(1000).optional(),
          authorName: z.string().min(1).max(80),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const product = await ctx.prisma.product.findUnique({ where: { slug: input.productSlug }, select: { id: true } });
        if (!product) throw new Error("Product not found");
        const review = await ctx.prisma.review.create({
          data: {
            productId: product.id,
            rating: input.rating,
            comment: input.comment ?? null,
            authorName: input.authorName,
          },
        });
        const agg = await ctx.prisma.review.aggregate({ where: { productId: product.id }, _avg: { rating: true }, _count: { rating: true } });
        await ctx.prisma.product.update({
          where: { id: product.id },
          data: { ratingAvg: agg._avg.rating ?? 0, ratingCount: agg._count.rating },
        });
        return review;
      }),
  }),
  products: router({
    meta: publicProcedure.query(async ({ ctx }) => {
      const categories = await ctx.prisma.category.findMany({ select: { slug: true, name: true }, orderBy: { name: "asc" } });
      const statuses = await ctx.prisma.product.findMany({ select: { status: true }, distinct: ["status"] });
      return {
        categories,
        statuses: statuses.map((s) => s.status),
      };
    }),
    list: publicProcedure
      .input(
        z
          .object({
            category: z.string().optional(),
            status: z.string().optional(),
            sort: z.enum(["price-asc", "price-desc", "new"]).optional(),
          })
          .optional()
      )
      .query(async ({ ctx, input }) => {
        const where = {
          ...(input?.category ? { category: { slug: input.category } } : {}),
          ...(input?.status ? { status: input.status } : {}),
        };
        const orderBy = (() => {
          if (input?.sort === "price-asc") return { price: "asc" } as const;
          if (input?.sort === "price-desc") return { price: "desc" } as const;
          return { createdAt: "desc" } as const;
        })();

        const items = await ctx.prisma.product.findMany({
          take: 24,
          orderBy,
          where,
          select: productCardSelect,
        });
        return items.map((p) => ({
          id: p.id,
          slug: p.slug,
          title: p.name,
          subtitle: p.description ?? "",
          price: formatPrice(p.price),
          badge: p.status,
          image: p.images[0]?.url ?? FALLBACK_IMG,
          alt: p.images[0]?.alt ?? p.name,
          ratingAvg: p.ratingAvg ?? null,
          ratingCount: p.ratingCount ?? null,
        }));
      }),
    bySlug: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
      const p = await ctx.prisma.product.findUnique({
        where: { slug: input },
        select: {
          ...productCardSelect,
          images: { select: { url: true, alt: true } },
        },
      });
      if (!p) return null;
      return {
        id: p.id,
        slug: p.slug,
        title: p.name,
        subtitle: p.description ?? "",
        price: formatPrice(p.price),
        rawPrice: p.price,
        badge: p.status,
        image: p.images[0]?.url ?? FALLBACK_IMG,
        alt: p.images[0]?.alt ?? p.name,
        images: p.images.length > 0 ? p.images : [{ url: FALLBACK_IMG, alt: p.name }],
        specs: p.specs,
        ratingAvg: p.ratingAvg ?? null,
        ratingCount: p.ratingCount ?? null,
        reviews: p.reviews,
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
