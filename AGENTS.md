# AGENTS.md — Wood & Metal Shop
## Руководство для AI-агентов и разработчиков

> Этот файл — главный источник истины для всех AI-ассистентов (Cursor, Windsurf, Copilot, Claude Code).
> Читай его **полностью** перед тем как писать любой код. Не нарушай правила без явного подтверждения от разработчика.

---

## 📋 Содержание

1. [О проекте](#1-о-проекте)
2. [Архитектура проекта](#2-архитектура-проекта)
3. [Стек и зависимости](#3-стек-и-зависимости)
4. [Дорожная карта](#4-дорожная-карта)
5. [Правила написания кода](#5-правила-написания-кода)
6. [Дизайн-система](#6-дизайн-система)
7. [База данных](#7-база-данных)
8. [API и маршруты](#8-api-и-маршруты)
9. [Анимации и визуальные эффекты](#9-анимации-и-визуальные-эффекты)
10. [Тестирование](#10-тестирование)
11. [Правила для AI-агентов](#11-правила-для-ai-агентов)
12. [Частые ошибки — не делай этого](#12-частые-ошибки--не-делай-этого)

---

## 1. О проекте

**Название:** Wood & Metal Shop  
**Тип:** B2C интернет-магазин премиального сегмента  
**Продукт:** Дизайнерская мебель из дерева и металлический декор  
**Аудитория:** Дизайнеры интерьеров, архитекторы, частные клиенты с высоким доходом  

### Ключевые цели продукта
- Создать ощущение галереи, а не обычного магазина
- Товар — главный герой: большие фото, минимум UI-шума
- Конверсия через доверие: качество съёмки, детали материалов, история бренда
- Lighthouse Score ≥ 90 по всем метрикам

### Монорепо структура
```
wood-metal-shop/
├── apps/
│   └── web/                    # Next.js 14 приложение
├── packages/
│   ├── ui/                     # Shared UI компоненты
│   ├── db/                     # Prisma схема и клиент
│   ├── config/                 # ESLint, Tailwind, TypeScript конфиги
│   └── types/                  # Shared TypeScript типы
├── AGENTS.md                   # ← этот файл
├── package.json                # Turborepo workspace
└── turbo.json
```

---

## 2. Архитектура проекта

### Структура `apps/web/`
```
apps/web/
├── app/                        # Next.js App Router
│   ├── (marketing)/            # Route group: публичные страницы
│   │   ├── page.tsx            # Главная страница
│   │   ├── catalog/
│   │   │   ├── page.tsx        # Каталог с фильтрами
│   │   │   └── [slug]/
│   │   │       └── page.tsx    # Страница товара
│   │   ├── collections/
│   │   │   └── [slug]/page.tsx
│   │   └── about/page.tsx
│   ├── (account)/              # Route group: личный кабинет
│   │   ├── layout.tsx          # Защищённый layout с Clerk
│   │   ├── orders/page.tsx
│   │   ├── wishlist/page.tsx
│   │   └── profile/page.tsx
│   ├── (checkout)/             # Route group: оформление заказа
│   │   ├── cart/page.tsx
│   │   └── checkout/page.tsx
│   ├── api/                    # Route Handlers
│   │   ├── trpc/[trpc]/route.ts
│   │   ├── webhooks/
│   │   │   └── stripe/route.ts
│   │   └── revalidate/route.ts
│   ├── layout.tsx              # Root layout
│   ├── not-found.tsx
│   └── error.tsx
├── components/
│   ├── layout/                 # Header, Footer, Navigation
│   ├── home/                   # Секции главной страницы
│   ├── catalog/                # Фильтры, сетка, карточки
│   ├── product/                # Галерея, конфигуратор, детали
│   ├── cart/                   # Корзина, мини-корзина
│   ├── ui/                     # Атомарные компоненты (из packages/ui)
│   └── animations/             # GSAP-обёртки, motion компоненты
├── lib/
│   ├── trpc/                   # tRPC клиент и провайдер
│   ├── algolia/                # Algolia клиент и хелперы
│   ├── stripe/                 # Stripe утилиты
│   ├── sanity/                 # Sanity клиент и GROQ-запросы
│   └── utils.ts                # cn(), formatPrice(), etc.
├── hooks/                      # Кастомные React хуки
├── store/                      # Zustand store (корзина, UI-стейт)
├── styles/
│   └── globals.css
└── middleware.ts               # Clerk auth + edge redirects
```

### Принципы архитектуры

**Server Components по умолчанию.** Используй `"use client"` только когда нужны: браузерные API, useState/useEffect, обработчики событий, сторонние клиентские библиотеки.

**Разделение данных и UI.** Компоненты не знают об источнике данных — они принимают props. Вся логика получения данных — в серверных компонентах или tRPC.

**Граница клиент/сервер.** GSAP и Framer Motion — всегда `"use client"`. Оборачивай их в отдельные компоненты-обёртки, не загрязняй серверные страницы.

---

## 3. Стек и зависимости

### Ядро
| Пакет | Версия | Назначение |
|-------|--------|-----------|
| `next` | `14.x` | Фреймворк, App Router, Image, Font |
| `react` | `18.x` | UI |
| `typescript` | `5.x` | Типизация |
| `tailwindcss` | `3.x` | Стилизация |
| `@clerk/nextjs` | `latest` | Аутентификация |
| `@trpc/server` + `@trpc/client` | `11.x` | Типизированный API |
| `zod` | `3.x` | Валидация схем |
| `prisma` | `5.x` | ORM |
| `@supabase/supabase-js` | `2.x` | Supabase клиент |

### UI и анимации
| Пакет | Назначение |
|-------|-----------|
| `gsap` | Сложные анимации, ScrollTrigger, Timeline |
| `@gsap/react` | useGSAP хук |
| `framer-motion` | Page transitions, micro-interactions |
| `lenis` | Smooth scroll |
| `@radix-ui/*` | Headless компоненты (через shadcn/ui) |

### Поиск и медиа
| Пакет | Назначение |
|-------|-----------|
| `algoliasearch` | Algolia клиент |
| `react-instantsearch` | UI для поиска и фильтров |
| `next-sanity` | Sanity интеграция |
| `@sanity/image-url` | Трансформации изображений Sanity |
| `stripe` | Платёжный шлюз |
| `zustand` | Глобальный стейт (корзина) |

### Dev инструменты
```json
{
  "eslint": "eslint-config-next + custom rules",
  "prettier": "с tailwindcss plugin для сортировки классов",
  "husky": "pre-commit хуки",
  "lint-staged": "линтинг только изменённых файлов",
  "turbo": "монорепо build pipeline"
}
```

### Установка новых зависимостей
```bash
# Всегда указывай workspace
pnpm add <package> --filter web

# Dev зависимость
pnpm add -D <package> --filter web

# Shared пакет в packages/
pnpm add <package> --filter @wood-metal/ui
```

---

## 4. Дорожная карта

> Текущая фаза всегда отмечена `→`. Завершённые — `✅`. Не начатые — `○`.

### → Фаза 1: Фундамент (Недели 1–3)

**Цель:** Рабочий скелет проекта с дизайн-системой.

```
✅ Инициализация монорепо (Turborepo + pnpm)
✅ Настройка Next.js 14 с App Router
✅ TypeScript конфигурация (строгий режим)
→  Tailwind + дизайн-токены (цвета, типографика, spacing)
○  Базовые UI компоненты: Button, Card, Input, Badge, Skeleton
○  Prisma схема (products, categories, users, orders, reviews)
○  Supabase подключение + миграции
○  Clerk аутентификация + middleware защита роутов
○  CI/CD: GitHub Actions → Vercel
○  Sanity studio настройка + схемы контента
```

**Задачи для AI в этой фазе:**
- Генерировать типы Prisma после изменения схемы
- Создавать shadcn/ui компоненты командой `npx shadcn-ui@latest add`
- Писать Zod схемы для всех форм и API

---

### ○ Фаза 2: Ключевые страницы (Недели 4–7)

**Цель:** Главная страница со всеми эффектами + полноценный каталог.

```
○  Hero секция (fullscreen видео + GSAP text reveal)
○  Marquee лента коллекций (Framer Motion)
○  Product Spotlight сетка (hover эффекты)
○  Horizontal scroll секция (GSAP ScrollTrigger pinning)
○  Каталог: Algolia InstantSearch интеграция
○  Система фильтров (URL-синхронизация через nuqs)
○  Карточки товара: Quick View, Wishlist, hover анимации
○  Skeleton loading states для каталога
```

---

### ○ Фаза 3: Purchase Flow (Недели 8–10)

**Цель:** Полный цикл покупки от страницы товара до подтверждения.

```
○  Страница товара: галерея, zoom, конфигуратор, табы
○  Корзина (Zustand store + Supabase sync)
○  Оформление заказа (multi-step форма)
○  Stripe интеграция: Elements + Webhooks
○  Email уведомления (Resend)
○  Страница успеха с анимацией
```

---

### ○ Фаза 4: Полноценный продакшн (Недели 11–13)

```
○  Личный кабинет: история заказов, профиль
○  Wishlist с сохранением
○  Отзывы с фото
○  SEO: метаданные, JSON-LD, sitemap
○  PostHog аналитика
○  Sentry error tracking
○  E2E тесты (Playwright)
○  Lighthouse оптимизация → 90+
```

---

### ○ Фаза 5: Расширение (Недели 14–16)

```
○  3D просмотр товара (Three.js / React Three Fiber)
○  AR превью (WebXR API)
○  A/B тесты (PostHog)
○  PWA манифест
○  Мультиязычность (next-intl)
```

---

## 5. Правила написания кода

### TypeScript

```typescript
// ✅ Всегда типизируй props явно
interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact';
  onAddToCart?: (id: string) => void;
}

// ✅ Используй type для union/intersection, interface для объектов
type ProductStatus = 'in_stock' | 'out_of_stock' | 'made_to_order';
interface Product { id: string; status: ProductStatus; }

// ❌ Никогда не используй any
const data: any = await fetch(...) // ЗАПРЕЩЕНО

// ✅ Используй unknown с type guard
const data: unknown = await fetch(...)
if (isProduct(data)) { /* ... */ }

// ✅ Строгий режим tsconfig
{
  "strict": true,
  "noUncheckedIndexedAccess": true,
  "exactOptionalPropertyTypes": true
}
```

### React компоненты

```typescript
// ✅ Server Component по умолчанию (без "use client")
// apps/web/app/catalog/page.tsx
export default async function CatalogPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const products = await getProducts(searchParams);
  return <ProductGrid products={products} />;
}

// ✅ Client Component только при необходимости
// components/catalog/FilterPanel.tsx
"use client";
import { useState } from "react";

export function FilterPanel({ initialFilters }: FilterPanelProps) {
  const [open, setOpen] = useState(false);
  // ...
}

// ✅ Suspense для async компонентов
import { Suspense } from "react";
import { ProductGridSkeleton } from "@/components/catalog/ProductGridSkeleton";

export default function CatalogPage() {
  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      <ProductGrid />
    </Suspense>
  );
}
```

### Стиль именования
```
Компоненты:         PascalCase     → ProductCard.tsx
Хуки:               camelCase      → useProductFilter.ts
Утилиты:            camelCase      → formatPrice.ts
Константы:          UPPER_SNAKE    → MAX_PRODUCTS_PER_PAGE
CSS переменные:     kebab-case     → --color-brand-primary
Типы/интерфейсы:    PascalCase     → type ProductVariant
Директории:         kebab-case     → product-card/
```

### Импорты — порядок
```typescript
// 1. React и Next.js
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// 2. Внешние библиотеки
import { motion } from "framer-motion";
import { gsap } from "gsap";

// 3. Internal packages
import { Button } from "@wood-metal/ui";
import { type Product } from "@wood-metal/types";

// 4. Алиасы проекта
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/store/cart";

// 5. Относительные импорты
import { ProductImage } from "./ProductImage";
```

### Обработка ошибок
```typescript
// ✅ В Server Components — throw, Next.js поймает error.tsx
export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.slug);
  if (!product) notFound(); // Вызывает not-found.tsx
  return <ProductDetail product={product} />;
}

// ✅ В tRPC — используй TRPCError
import { TRPCError } from "@trpc/server";

if (!product) {
  throw new TRPCError({ code: "NOT_FOUND", message: "Товар не найден" });
}

// ✅ В Client Components — Error Boundary или локальный стейт
const [error, setError] = useState<string | null>(null);
```

---

## 6. Дизайн-система

### Токены цветов (Tailwind config)
```javascript
// tailwind.config.ts
colors: {
  brand: {
    black:   '#1B1B1B',  // Основной текст
    white:   '#FFFFFF',  // Фон
    gold:    '#8B6914',  // Акцент (дерево)
    'gold-light': '#F5EDD8', // Фон акцентных блоков
  },
  neutral: {
    50:  '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  }
}
```

### Типографика
```css
/* globals.css */
/* Заголовки: Editorial New (платный) или Playfair Display (бесплатный) */
/* UI текст: DM Sans */

--font-display: 'Playfair Display', Georgia, serif;
--font-body: 'DM Sans', system-ui, sans-serif;

/* Размеры (fluid typography) */
--text-display: clamp(2.5rem, 5vw, 5rem);     /* Hero заголовки */
--text-heading: clamp(1.75rem, 3vw, 2.5rem);  /* H1 */
--text-title:   clamp(1.25rem, 2vw, 1.75rem); /* H2 */
--text-body:    1rem;                           /* Основной текст */
--text-small:   0.875rem;                      /* Подписи */
--text-caption: 0.75rem;                       /* Метки */
```

### Утилита `cn()`
```typescript
// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Использование
<div className={cn(
  "base-class",
  isActive && "active-class",
  variant === "dark" && "dark-variant"
)} />
```

### Форматирование цены
```typescript
// lib/utils.ts
export function formatPrice(
  amount: number,
  currency: string = "RUB"
): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
// → "125 000 ₽"
```

### Компоненты — размеры и варианты
Все компоненты должны поддерживать стандартные варианты:
```typescript
// Кнопки
variant: 'primary' | 'secondary' | 'ghost' | 'link'
size:    'sm' | 'md' | 'lg'

// Карточки
variant: 'default' | 'compact' | 'featured'

// Бейджи
variant: 'new' | 'sale' | 'popular' | 'custom'
```

---

## 7. База данных

### Prisma схема (ключевые модели)
```prisma
// packages/db/prisma/schema.prisma

model Product {
  id          String   @id @default(cuid())
  slug        String   @unique
  name        String
  description String?  @db.Text
  price       Int      // В копейках/центах
  status      ProductStatus @default(IN_STOCK)
  
  categoryId  String
  category    Category @relation(fields: [categoryId], references: [id])
  
  images      ProductImage[]
  variants    ProductVariant[]
  reviews     Review[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([slug])
  @@index([categoryId])
  @@index([status])
}

enum ProductStatus {
  IN_STOCK
  OUT_OF_STOCK
  MADE_TO_ORDER
  ARCHIVED
}
```

### Правила работы с БД

```typescript
// ✅ Всегда выбирай только нужные поля
const products = await prisma.product.findMany({
  select: {
    id: true,
    slug: true,
    name: true,
    price: true,
    images: { take: 1, select: { url: true, alt: true } },
  },
});

// ❌ Никогда не делай findMany без limit в API
const products = await prisma.product.findMany(); // ЗАПРЕЩЕНО

// ✅ Всегда paginate
const products = await prisma.product.findMany({
  take: 24,
  skip: (page - 1) * 24,
  orderBy: { createdAt: 'desc' },
});

// ✅ Транзакции для связанных операций
await prisma.$transaction(async (tx) => {
  const order = await tx.order.create({ data: orderData });
  await tx.orderItem.createMany({ data: itemsData });
  return order;
});
```

### Миграции
```bash
# Создать миграцию после изменения схемы
pnpm --filter db prisma migrate dev --name <описание_изменения>

# Применить миграции на продакшне (CI/CD)
pnpm --filter db prisma migrate deploy

# Генерировать типы
pnpm --filter db prisma generate
```

---

## 8. API и маршруты

### tRPC роутеры
```
apps/web/lib/trpc/
├── routers/
│   ├── products.ts   # getById, getMany, search, getFeatured
│   ├── cart.ts       # get, addItem, removeItem, updateQuantity
│   ├── orders.ts     # create, getById, getMyOrders
│   ├── wishlist.ts   # get, toggle
│   └── reviews.ts    # getByProduct, create
├── root.ts           # appRouter (объединение всех роутеров)
├── trpc.ts           # initTRPC, контексты, middleware
└── client.ts         # клиентский хелпер
```

### Правила tRPC процедур
```typescript
// ✅ publicProcedure — публичные данные
// ✅ protectedProcedure — требует аутентификации
// ✅ adminProcedure — требует роль admin

// Пример роутера
export const productsRouter = createTRPCRouter({
  getMany: publicProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(48).default(24),
      categorySlug: z.string().optional(),
      status: z.nativeEnum(ProductStatus).optional(),
    }))
    .query(async ({ ctx, input }) => {
      // ...
    }),
});
```

### Webhooks
```typescript
// app/api/webhooks/stripe/route.ts
// ✅ Всегда верифицируй подпись
export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;
  
  const event = stripe.webhooks.constructEvent(
    body, signature, process.env.STRIPE_WEBHOOK_SECRET!
  );
  // ...
}
```

### Переменные окружения
```bash
# .env.example — коммитить в репозиторий (без значений!)
# .env.local  — локальные секреты, в .gitignore

# Database
DATABASE_URL=
DIRECT_URL=

# Auth (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Algolia
NEXT_PUBLIC_ALGOLIA_APP_ID=
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=
ALGOLIA_ADMIN_KEY=

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
SANITY_API_TOKEN=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **AI-агент:** никогда не добавляй реальные значения секретов в код или комментарии.

---

## 9. Анимации и визуальные эффекты

### Когда что использовать

| Сценарий | Инструмент |
|----------|-----------|
| Parallax, ScrollTrigger, Timeline | GSAP |
| Page transitions, exit animations | Framer Motion |
| Smooth scroll (инерция) | Lenis |
| Простые hover, fade | Tailwind transitions |
| 3D объекты | Three.js / React Three Fiber |

### GSAP — паттерн использования
```typescript
// components/animations/HeroReveal.tsx
"use client";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export function HeroReveal({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    
    tl.from(".hero-title span", {
      y: 80,
      opacity: 0,
      stagger: 0.08,
      duration: 1,
      ease: "power3.out",
    })
    .from(".hero-subtitle", {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
    }, "-=0.4");

  }, { scope: containerRef });

  return <div ref={containerRef}>{children}</div>;
}
```

### Framer Motion — page transitions
```typescript
// components/animations/PageTransition.tsx
"use client";
import { motion, AnimatePresence } from "framer-motion";

const variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.25 } },
};

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={variants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  );
}
```

### Lenis — инициализация
```typescript
// components/layout/SmoothScroll.tsx
"use client";
import Lenis from "lenis";
import { useEffect } from "react";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    
    return () => lenis.destroy();
  }, []);

  return <>{children}</>;
}
```

### Правила производительности анимаций
- Анимируй ТОЛЬКО `transform` и `opacity` — никогда `width`, `height`, `top`, `left`
- Используй `will-change: transform` только на активно анимируемых элементах
- Удаляй `will-change` после завершения анимации
- Группируй ScrollTrigger в одном `useGSAP` scope — меньше listeners
- Lazy load тяжёлых анимационных компонентов через `dynamic()`

---

## 10. Тестирование

### Структура тестов
```
apps/web/
├── __tests__/
│   ├── unit/
│   │   ├── utils/
│   │   │   ├── formatPrice.test.ts
│   │   │   └── cn.test.ts
│   │   └── hooks/
│   │       └── useCart.test.ts
│   └── integration/
│       └── api/
│           └── products.test.ts
└── e2e/                        # Playwright
    ├── catalog.spec.ts
    ├── checkout.spec.ts
    └── auth.spec.ts
```

### Unit тесты (Vitest)
```typescript
// __tests__/unit/utils/formatPrice.test.ts
import { describe, it, expect } from "vitest";
import { formatPrice } from "@/lib/utils";

describe("formatPrice", () => {
  it("formats RUB correctly", () => {
    expect(formatPrice(125000)).toBe("125 000 ₽");
  });
  it("handles zero", () => {
    expect(formatPrice(0)).toBe("0 ₽");
  });
});
```

### E2E тесты (Playwright)
```typescript
// e2e/catalog.spec.ts
import { test, expect } from "@playwright/test";

test("фильтрация по категории работает", async ({ page }) => {
  await page.goto("/catalog");
  await page.click('[data-testid="filter-category-sofa"]');
  await expect(page.locator('[data-testid="product-card"]')).toHaveCount({ min: 1 });
  await expect(page.url()).toContain("category=sofa");
});
```

### Запуск тестов
```bash
pnpm test              # Unit + Integration (Vitest)
pnpm test:e2e          # E2E (Playwright)
pnpm test:coverage     # Coverage report
```

### Требования к покрытию
- Утилитарные функции: 100%
- tRPC роутеры: 80%+
- Критические UI компоненты (корзина, checkout): 70%+

---

## 11. Правила для AI-агентов

> Эти правила обязательны для Cursor, Windsurf, GitHub Copilot и других AI-инструментов.

### ✅ Всегда делай

**Читай контекст перед кодом.**
Перед написанием любого файла проверь существующие связанные файлы. Не дублируй логику, которая уже есть.

**Сохраняй единый стиль.**
Следуй конвенциям, которые видишь в уже написанном коде проекта. Имитируй паттерны, а не изобретай новые.

**Типизируй всё.**
Каждый props, каждый ответ API, каждый Zod-схема должны быть строго типизированы.

**Используй существующие утилиты.**
`cn()`, `formatPrice()`, компоненты из `packages/ui` — всё это уже есть. Используй их.

**Добавляй `data-testid` атрибуты.**
На все интерактивные и значимые элементы для E2E тестов.
```tsx
<button data-testid="add-to-cart-btn" onClick={handleAdd}>
```

**Комментируй нетривиальную логику.**
Сложные алгоритмы, workarounds, неочевидные решения — объясняй кратко.
```typescript
// Цена хранится в копейках для избежания проблем с float
const priceInKopecks = Math.round(price * 100);
```

**Оптимизируй изображения через next/image.**
```tsx
// ✅
<Image src={url} alt={alt} width={800} height={600} quality={85} placeholder="blur" />
// ❌
<img src={url} alt={alt} />
```

---

### ❌ Никогда не делай

**Не используй `any`.**
```typescript
// ❌ ЗАПРЕЩЕНО
const data: any = response.data;
function handle(event: any) {}
```

**Не мутируй state напрямую.**
```typescript
// ❌
state.products.push(newProduct);
// ✅
setState(prev => ({ ...prev, products: [...prev.products, newProduct] }));
```

**Не делай прямые вызовы Prisma из компонентов.**
Только через tRPC процедуры или Server Actions.

**Не оставляй console.log в коде.**
Только в процессе отладки, удаляй перед коммитом.

**Не хардкоди строки и числа.**
```typescript
// ❌
if (status === "in_stock") {}
const limit = 24;

// ✅
if (status === ProductStatus.IN_STOCK) {}
const PRODUCTS_PER_PAGE = 24;
```

**Не добавляй зависимости без необходимости.**
Если задачу можно решить встроенными средствами Next.js или уже установленными пакетами — не устанавливай новые.

**Не создавай компоненты в `app/` директории.**
Компоненты живут в `components/`. В `app/` — только страницы, layout и loading/error.

**Не игнорируй ошибки TypeScript.**
```typescript
// ❌
// @ts-ignore
// @ts-expect-error
```

---

### Алгоритм работы AI при получении задачи

```
1. ПРОЧИТАЙ задачу полностью
2. ОПРЕДЕЛИ затронутые файлы (какие нужно создать / изменить)
3. ПРОВЕРЬ существующий код в этих файлах
4. ПРОВЕРЬ типы в packages/types — возможно они уже есть
5. НАПИШИ код, следуя правилам этого файла
6. ПРОВЕРЬ: нет ли дублирования? нет ли any? нет ли console.log?
7. СООБЩИ о побочных эффектах (нужны ли миграции, ENV переменные)
```

### Формат ответа AI

При генерации кода всегда указывай путь к файлу:
```typescript
// apps/web/components/catalog/ProductCard.tsx
```

Если нужно добавить переменную окружения, напоминай:
```
⚠️ Добавь в .env.local:
ALGOLIA_ADMIN_KEY=your_key_here
```

Если изменение схемы БД — напоминай о миграции:
```
⚠️ После этого изменения запусти:
pnpm --filter db prisma migrate dev --name add_product_variants
```

---

## 12. Частые ошибки — не делай этого

### Гидратация React
```typescript
// ❌ Разный контент на сервере и клиенте
function Component() {
  return <div>{Math.random()}</div>; // Ошибка гидратации!
}

// ✅ Используй useEffect для клиентских значений
function Component() {
  const [value, setValue] = useState<number | null>(null);
  useEffect(() => setValue(Math.random()), []);
  return <div>{value ?? "..."}</div>;
}
```

### Бесконечные ре-рендеры
```typescript
// ❌ Объект в dependency array
useEffect(() => {
  fetchData(filters); // filters — объект, новый на каждый рендер
}, [filters]);

// ✅ Примитивные значения или useMemo
const filterKey = JSON.stringify(filters);
useEffect(() => {
  fetchData(filters);
}, [filterKey]);
```

### Утечки памяти в GSAP
```typescript
// ❌ GSAP без cleanup
useEffect(() => {
  gsap.to(".element", { opacity: 1 });
}, []);

// ✅ Используй useGSAP — он сам делает cleanup
useGSAP(() => {
  gsap.to(".element", { opacity: 1 });
}, { scope: containerRef });
```

### Неоптимальные запросы к Prisma
```typescript
// ❌ N+1 проблема
const products = await prisma.product.findMany();
for (const product of products) {
  const images = await prisma.productImage.findMany({ where: { productId: product.id } });
}

// ✅ Eager loading через include/select
const products = await prisma.product.findMany({
  include: { images: { take: 1 } }
});
```

### Отсутствие loading states
```typescript
// ❌ Контент появляется резко
{data && <ProductGrid products={data} />}

// ✅ Всегда Suspense + Skeleton
<Suspense fallback={<ProductGridSkeleton />}>
  <ProductGrid />
</Suspense>
```

---

## Быстрые команды

```bash
# Разработка
pnpm dev                          # Запуск dev сервера
pnpm build                        # Production build
pnpm lint                         # ESLint
pnpm type-check                   # TypeScript проверка

# База данных
pnpm db:migrate                   # Применить миграции
pnpm db:push                      # Push схемы (без миграций)
pnpm db:studio                    # Prisma Studio GUI
pnpm db:seed                      # Заполнить тестовыми данными

# Тесты
pnpm test                         # Unit тесты
pnpm test:e2e                     # E2E тесты
pnpm test:watch                   # Watch mode

# Утилиты
pnpm clean                        # Очистить node_modules + .next
pnpm analyze                      # Bundle analyzer
```

---

*Версия документа: 1.0 | Последнее обновление: синхронизируй с изменениями в проекте*  
*При конфликте между этим файлом и другим — этот файл в приоритете.*
