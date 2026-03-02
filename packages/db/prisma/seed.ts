import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const products = [
  // ── ГОСТИНАЯ ───────────────────────────────────────────────────────────
  {
    slug: "linen-sofa",
    name: "Диван Linen Loft",
    description: "Лён, массив дуба, съёмные чехлы",
    price: 215000,
    status: "IN_STOCK",
    specs: JSON.stringify({ seats: 3, width: "230", cover: "Съёмный лён", legs: "Дуб" }),
    ratingAvg: 4.9,
    ratingCount: 27,
    category: { connectOrCreate: { where: { slug: "living" }, create: { slug: "living", name: "Гостиная" } } },
    images: { create: [{ url: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=80", alt: "Льняной диван с дубовыми ножками", order: 0 }] },
    variants: { create: [{ name: "Лён натуральный", sku: "LINEN-NAT", priceDiff: 0 }, { name: "Лён серый", sku: "LINEN-GRY", priceDiff: 5000 }] },
  },
  {
    slug: "atelier-console",
    name: "Консоль Atelier",
    description: "Дуб + сталь, тонкий профиль",
    price: 142000,
    status: "MADE_TO_ORDER",
    specs: JSON.stringify({ material: "Дуб/сталь", depth: "32", finish: "Масло", width: "140" }),
    category: { connectOrCreate: { where: { slug: "living" }, create: { slug: "living", name: "Гостиная" } } },
    images: { create: [{ url: "https://images.unsplash.com/photo-1630835016331-1a9b60581820?auto=format&fit=crop&w=1200&q=80", alt: "Консоль из дуба и стали", order: 0 }] },
  },
  {
    slug: "oak-tv-stand",
    name: "ТВ-тумба Oak Low",
    description: "Массив дуба, открытые полки, металлические ножки",
    price: 87000,
    status: "IN_STOCK",
    specs: JSON.stringify({ material: "Дуб", width: "160", height: "45", finish: "Масло" }),
    ratingAvg: 4.7,
    ratingCount: 9,
    category: { connectOrCreate: { where: { slug: "living" }, create: { slug: "living", name: "Гостиная" } } },
    images: { create: [{ url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80", alt: "Низкая дубовая тумба в гостиной", order: 0 }] },
    variants: { create: [{ name: "160 см", sku: "TVOAK-160", priceDiff: 0 }, { name: "200 см", sku: "TVOAK-200", priceDiff: 15000 }] },
  },
  {
    slug: "brass-coffee-table",
    name: "Журнальный стол Brass Ring",
    description: "Латунный каркас, столешница из тонированного стекла",
    price: 78000,
    status: "IN_STOCK",
    specs: JSON.stringify({ base: "Латунь", top: "Стекло 10мм", diameter: "80", height: "40" }),
    ratingAvg: 4.5,
    ratingCount: 14,
    category: { connectOrCreate: { where: { slug: "living" }, create: { slug: "living", name: "Гостиная" } } },
    images: { create: [{ url: "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?auto=format&fit=crop&w=1200&q=80", alt: "Журнальный стол с латунным каркасом", order: 0 }] },
  },
  // ── СТОЛОВАЯ ───────────────────────────────────────────────────────────
  {
    slug: "sphere-table",
    name: "Стол Sphere",
    description: "Столешница из ореха, основание — латунь",
    price: 189000,
    status: "IN_STOCK",
    specs: JSON.stringify({ top: "Массив ореха", base: "Латунь", diameter: "140" }),
    ratingAvg: 4.6,
    ratingCount: 18,
    category: { connectOrCreate: { where: { slug: "dining" }, create: { slug: "dining", name: "Столовая" } } },
    images: { create: [{ url: "https://images.unsplash.com/photo-1766023505762-2fd1359c4cb8?auto=format&fit=crop&w=1200&q=80", alt: "Круглый обеденный стол", order: 0 }] },
    variants: { create: [{ name: "140 см", sku: "SPHERE-140", priceDiff: 0 }, { name: "160 см", sku: "SPHERE-160", priceDiff: 22000 }] },
  },
  {
    slug: "ridge-dining-chair",
    name: "Стул Ridge",
    description: "Дуб и натуральная кожа, ручная прошивка",
    price: 42000,
    status: "IN_STOCK",
    specs: JSON.stringify({ material: "Дуб/кожа", seat: "Натуральная кожа", height: "85" }),
    ratingAvg: 4.8,
    ratingCount: 31,
    category: { connectOrCreate: { where: { slug: "dining" }, create: { slug: "dining", name: "Столовая" } } },
    images: { create: [{ url: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=1200&q=80", alt: "Деревянный стул с кожаным сиденьем", order: 0 }] },
    variants: { create: [{ name: "Тёмная кожа", sku: "RIDGEC-DRK", priceDiff: 0 }, { name: "Светлая кожа", sku: "RIDGEC-LGT", priceDiff: 0 }] },
  },
  {
    slug: "metal-bar-stool",
    name: "Барный стул Steel",
    description: "Чернёная сталь, сиденье из натуральной кожи",
    price: 38000,
    status: "IN_STOCK",
    specs: JSON.stringify({ frame: "Чернёная сталь", seat: "Кожа", height: "65", footrest: "Да" }),
    ratingAvg: 4.4,
    ratingCount: 8,
    category: { connectOrCreate: { where: { slug: "dining" }, create: { slug: "dining", name: "Столовая" } } },
    images: { create: [{ url: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1200&q=80", alt: "Барный стул из чернёной стали", order: 0 }] },
  },
  // ── СПАЛЬНЯ ────────────────────────────────────────────────────────────
  {
    slug: "ridge-dresser",
    name: "Комод Ridge",
    description: "Орех матовый, ручная работа",
    price: 125000,
    status: "IN_STOCK",
    specs: JSON.stringify({ material: "Орех", finish: "Матовый", size: "120 x 45 x 85", drawers: 4 }),
    ratingAvg: 4.8,
    ratingCount: 12,
    category: { connectOrCreate: { where: { slug: "bedroom" }, create: { slug: "bedroom", name: "Спальня" } } },
    images: { create: [{ url: "https://images.unsplash.com/photo-1535049752-3baf525dd015?auto=format&fit=crop&w=1200&q=80", alt: "Комод из массива ореха", order: 0 }] },
    variants: { create: [{ name: "Орех", sku: "RIDGE-OR", priceDiff: 0 }, { name: "Дуб", sku: "RIDGE-DB", priceDiff: -5000 }] },
  },
  {
    slug: "oak-bed-frame",
    name: "Кровать Oak Solid",
    description: "Массив дуба, изголовье с мягкой обивкой льном",
    price: 285000,
    status: "MADE_TO_ORDER",
    specs: JSON.stringify({ material: "Дуб", headboard: "Лён", size: "160 x 200", finish: "Масло" }),
    ratingAvg: 4.9,
    ratingCount: 7,
    category: { connectOrCreate: { where: { slug: "bedroom" }, create: { slug: "bedroom", name: "Спальня" } } },
    images: { create: [{ url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80", alt: "Кровать из дуба со льняным изголовьем", order: 0 }] },
    variants: { create: [{ name: "160×200", sku: "OAKBED-160", priceDiff: 0 }, { name: "180×200", sku: "OAKBED-180", priceDiff: 25000 }] },
  },
  {
    slug: "bedside-walnut",
    name: "Тумба Walnut Night",
    description: "Орех, одна полка, латунная ручка",
    price: 54000,
    status: "IN_STOCK",
    specs: JSON.stringify({ material: "Орех", handle: "Латунь", size: "45 x 35 x 55" }),
    ratingAvg: 4.7,
    ratingCount: 15,
    category: { connectOrCreate: { where: { slug: "bedroom" }, create: { slug: "bedroom", name: "Спальня" } } },
    images: { create: [{ url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80", alt: "Прикроватная тумба из ореха", order: 0 }] },
  },
  {
    slug: "arched-mirror",
    name: "Зеркало Arc",
    description: "Арочное зеркало в латунной раме",
    price: 67000,
    status: "IN_STOCK",
    specs: JSON.stringify({ frame: "Латунь", size: "70 x 180", type: "Напольное" }),
    ratingAvg: 4.6,
    ratingCount: 22,
    category: { connectOrCreate: { where: { slug: "bedroom" }, create: { slug: "bedroom", name: "Спальня" } } },
    images: { create: [{ url: "https://images.unsplash.com/photo-1531985208-f34456939a54?auto=format&fit=crop&w=1200&q=80", alt: "Арочное зеркало в латунной раме", order: 0 }] },
  },
  // ── ОСВЕЩЕНИЕ ──────────────────────────────────────────────────────────
  {
    slug: "arc-floor-lamp",
    name: "Торшер Arc",
    description: "Патинированный металл, тёплый свет",
    price: 62000,
    status: "IN_STOCK",
    specs: JSON.stringify({ height: "180", light: "Тёплый E27", material: "Сталь патин.", base: "Мрамор" }),
    ratingAvg: 4.7,
    ratingCount: 19,
    category: { connectOrCreate: { where: { slug: "lighting" }, create: { slug: "lighting", name: "Освещение" } } },
    images: { create: [{ url: "https://images.unsplash.com/photo-1678705424487-a59e52b08275?auto=format&fit=crop&w=1200&q=80", alt: "Торшер с патинированным металлом", order: 0 }] },
  },
  {
    slug: "brass-pendant",
    name: "Подвес Brass Drop",
    description: "Латунный подвес, молочное стекло, диммер",
    price: 28000,
    status: "IN_STOCK",
    specs: JSON.stringify({ material: "Латунь", shade: "Молочное стекло", cord: "Текстиль 2м", dimmer: "Да" }),
    ratingAvg: 4.8,
    ratingCount: 34,
    category: { connectOrCreate: { where: { slug: "lighting" }, create: { slug: "lighting", name: "Освещение" } } },
    images: { create: [{ url: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&w=1200&q=80", alt: "Латунный подвесной светильник", order: 0 }] },
    variants: { create: [{ name: "Одиночный", sku: "BRASS-S1", priceDiff: 0 }, { name: "Тройной", sku: "BRASS-S3", priceDiff: 42000 }] },
  },
  {
    slug: "table-lamp-steel",
    name: "Настольная лампа Steel",
    description: "Чернёная сталь, абажур из льна",
    price: 19500,
    status: "IN_STOCK",
    specs: JSON.stringify({ base: "Чернёная сталь", shade: "Лён", height: "45", bulb: "E14" }),
    ratingAvg: 4.5,
    ratingCount: 11,
    category: { connectOrCreate: { where: { slug: "lighting" }, create: { slug: "lighting", name: "Освещение" } } },
    images: { create: [{ url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80", alt: "Настольная лампа со стальным основанием", order: 0 }] },
  },
  // ── ХРАНЕНИЕ ───────────────────────────────────────────────────────────
  {
    slug: "oak-shelf",
    name: "Стеллаж Oak Frame",
    description: "Открытая система хранения, 5 полок",
    price: 98000,
    status: "IN_STOCK",
    specs: JSON.stringify({ tiers: 5, material: "Дуб", finish: "Масло", size: "90 x 30 x 185" }),
    ratingAvg: 4.7,
    ratingCount: 16,
    category: { connectOrCreate: { where: { slug: "storage" }, create: { slug: "storage", name: "Хранение" } } },
    images: { create: [{ url: "https://images.unsplash.com/photo-1768224461885-ea4785853779?auto=format&fit=crop&w=1200&q=80", alt: "Дубовый стеллаж с вазами", order: 0 }] },
    variants: { create: [{ name: "90 см", sku: "OAKSHLF-90", priceDiff: 0 }, { name: "120 см", sku: "OAKSHLF-120", priceDiff: 18000 }] },
  },
  {
    slug: "wardrobe-loft",
    name: "Шкаф Loft",
    description: "Распашной шкаф, дуб + металлический каркас",
    price: 195000,
    status: "MADE_TO_ORDER",
    specs: JSON.stringify({ material: "Дуб/сталь", width: "180", depth: "60", height: "220", doors: 2 }),
    category: { connectOrCreate: { where: { slug: "storage" }, create: { slug: "storage", name: "Хранение" } } },
    images: { create: [{ url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80", alt: "Шкаф в стиле лофт", order: 0 }] },
  },
  {
    slug: "entryway-bench",
    name: "Банкетка Entry",
    description: "Дуб, льняная подушка, крючки из латуни",
    price: 48000,
    status: "IN_STOCK",
    specs: JSON.stringify({ material: "Дуб", cushion: "Лён", hooks: 3, width: "120" }),
    ratingAvg: 4.8,
    ratingCount: 20,
    category: { connectOrCreate: { where: { slug: "storage" }, create: { slug: "storage", name: "Хранение" } } },
    images: { create: [{ url: "https://images.unsplash.com/photo-1594940830656-e0fbc9f48aad?auto=format&fit=crop&w=1200&q=80", alt: "Банкетка с крючками для прихожей", order: 0 }] },
  },
  {
    slug: "magazine-rack-brass",
    name: "Газетница Brass Stand",
    description: "Латунь, вощёный металл, минималистичный дизайн",
    price: 18500,
    status: "IN_STOCK",
    specs: JSON.stringify({ material: "Латунь", size: "30 x 15 x 55" }),
    ratingAvg: 4.3,
    ratingCount: 6,
    category: { connectOrCreate: { where: { slug: "storage" }, create: { slug: "storage", name: "Хранение" } } },
    images: { create: [{ url: "https://images.unsplash.com/photo-1581795669633-91ef7c9699a8?auto=format&fit=crop&w=1200&q=80", alt: "Латунная газетница", order: 0 }] },
  },
];

async function main() {
  // Clean slate
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const adminPasswordHash = await hash("admin123", 12);
  await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@dubstal.ru",
      passwordHash: adminPasswordHash,
    },
  });

  for (const product of products) {
    const created = await prisma.product.create({ data: product });

    await prisma.review.create({
      data: {
        productId: created.id,
        rating: Math.min(5, Math.max(3, Math.round((product as { ratingAvg?: number }).ratingAvg ?? 4.5))),
        comment: "Отличное качество материалов и аккуратная сборка.",
      },
    });
  }
  console.log("Seeded products:", products.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
