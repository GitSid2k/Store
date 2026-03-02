# SITE_ARCHITECTURE.md — Wood & Metal Shop
## Полная архитектура сайта: страницы, логика, связи, расписание

> **Главный документ архитектуры.** Описывает все страницы, их логику, взаимосвязи,
> потоки данных и пользовательские сценарии. Читай перед работой над любым роутом.

---

## 📋 Содержание

1. [Карта всех страниц](#1-карта-всех-страниц)
2. [Пользовательские пути (User Journeys)](#2-пользовательские-пути)
3. [Детализация каждой страницы](#3-детализация-каждой-страницы)
4. [Потоки данных и API](#4-потоки-данных-и-api)
5. [Бизнес-логика и правила](#5-бизнес-логика-и-правила)
6. [Состояние приложения (State)](#6-состояние-приложения)
7. [SEO-стратегия](#7-seo-стратегия)
8. [Расписание разработки](#8-расписание-разработки)
9. [Матрица связей страниц](#9-матрица-связей-страниц)

---

## 1. Карта всех страниц

### Полное дерево роутов

```
/ (Root)
├── / ................................................ Главная
│
├── /catalog .......................................... Каталог (все товары)
│   ├── /catalog/[category] .......................... Категория
│   │   └── /catalog/[category]/[subcategory] ........ Подкатегория
│   └── /catalog/search .............................. Результаты поиска
│
├── /product/[slug] .................................. Страница товара
│
├── /collections ..................................... Все коллекции
│   └── /collections/[slug] .......................... Страница коллекции
│
├── /about ........................................... О бренде
│   ├── /about/philosophy ............................ Философия
│   ├── /about/production ............................ Производство
│   └── /about/contacts .............................. Контакты
│
├── /blog ............................................ Блог / Вдохновение
│   └── /blog/[slug] ................................. Статья блога
│
├── /cart ............................................ Корзина
│
├── /checkout ........................................ Оформление заказа
│   ├── /checkout/delivery ........................... Шаг: Доставка
│   ├── /checkout/payment ............................ Шаг: Оплата
│   └── /checkout/success ............................ Успешный заказ
│
├── /wishlist ........................................ Список желаний (публичный)
│
├── /account ......................................... (Protected) Аккаунт
│   ├── /account/orders .............................. Мои заказы
│   │   └── /account/orders/[id] ..................... Детали заказа
│   ├── /account/wishlist ............................ Мой вишлист
│   ├── /account/profile ............................. Профиль
│   ├── /account/addresses ........................... Адреса доставки
│   └── /account/reviews ............................. Мои отзывы
│
├── /auth ............................................ Аутентификация
│   ├── /auth/sign-in ................................ Вход
│   ├── /auth/sign-up ................................ Регистрация
│   └── /auth/forgot-password ........................ Восстановление пароля
│
├── /legal ........................................... Юридические страницы
│   ├── /legal/privacy ............................... Политика конфиденциальности
│   ├── /legal/terms ................................. Условия использования
│   ├── /legal/delivery .............................. Условия доставки
│   └── /legal/returns ............................... Возврат и обмен
│
└── /api ............................................. API Routes (не страницы)
    ├── /api/trpc/[trpc] ............................. tRPC endpoint
    ├── /api/webhooks/stripe .......................... Stripe webhooks
    ├── /api/webhooks/clerk ........................... Clerk webhooks
    ├── /api/revalidate .............................. ISR revalidation
    ├── /api/og ...................................... Open Graph image gen
    └── /api/sitemap ................................. Sitemap generation
```

### Категории товаров

```
/catalog/furniture
├── /catalog/furniture/living-room     ← Гостиная
├── /catalog/furniture/bedroom         ← Спальня
├── /catalog/furniture/dining          ← Столовая
├── /catalog/furniture/office          ← Кабинет
└── /catalog/furniture/outdoor         ← Уличная

/catalog/decor
├── /catalog/decor/vases               ← Вазы
├── /catalog/decor/candles             ← Подсвечники
├── /catalog/decor/frames              ← Рамки
├── /catalog/decor/lighting            ← Светильники
└── /catalog/decor/sculptures          ← Скульптуры
```

---

## 2. Пользовательские пути

### Journey 1: Новый посетитель → Покупка

```
ТОЧКА ВХОДА: Google / Instagram / Direct
     ↓
[Главная /]
  └─ Видит Hero с коллекцией
  └─ Скроллит, видит Products Spotlight
  └─ Кликает на карточку товара
     ↓
[Страница товара /product/[slug]]
  └─ Изучает фото галереи
  └─ Читает описание и характеристики
  └─ Выбирает материал и размер
  └─ Кликает "Добавить в корзину"
     ↓
[Мини-корзина (sidebar) появляется]
  └─ Видит товар в корзине
  └─ Кликает "Оформить заказ"
     ↓
[/auth/sign-up] ← не авторизован
  └─ Регистрируется или входит
     ↓
[/checkout] ← Step 1: Контакты
  └─ Заполняет имя, email, телефон
     ↓
[/checkout/delivery] ← Step 2
  └─ Выбирает способ доставки
  └─ Вводит адрес
     ↓
[/checkout/payment] ← Step 3
  └─ Вводит карту (Stripe Elements)
  └─ Подтверждает заказ
     ↓
[/checkout/success]
  └─ Видит подтверждение
  └─ Получает email
  └─ Перенаправляется в /account/orders
```

### Journey 2: Вернувшийся клиент → Быстрая покупка

```
[Главная /] → авторизован
  └─ Корзина содержит товары (persist)
  └─ Переходит в /cart
     ↓
[/cart]
  └─ Проверяет состав
  └─ Применяет промокод
     ↓
[/checkout] → данные предзаполнены
  └─ Адрес из /account/addresses
  └─ Один клик на оплату
     ↓
[/checkout/success]
```

### Journey 3: Дизайнер → Исследование каталога

```
[/catalog] ← прямая ссылка или навигация
  └─ Настраивает фильтры (категория, материал, цена)
  └─ URL обновляется: /catalog/furniture?material=oak&price=50000-200000
  └─ Сохраняет ссылку / делится
     ↓
[Quick View popup] ← hover на карточке
  └─ Бегло просматривает без перехода
  └─ Добавляет в wishlist ♡
     ↓
[/product/[slug]] ← для детального изучения
  └─ Скачивает размерный лист (PDF)
  └─ Читает характеристики
  └─ Оставляет заявку на индивидуальный заказ
```

### Journey 4: Мобильный пользователь → Импульсная покупка

```
[Instagram → /product/[slug]] ← deeplink
  └─ Fullscreen фото галерея (swipe)
  └─ "Добавить в корзину" sticky снизу
     ↓
[Checkout одной страницей] ← упрощённый мобильный flow
  └─ Apple Pay / Google Pay ← один тап
     ↓
[Успех]
```

---

## 3. Детализация каждой страницы

---

### 🏠 Главная / (Home)

**Тип рендеринга:** SSG + ISR (revalidate: 3600)
**Данные:** Sanity CMS (контент) + Prisma (товары)

#### Секции и логика

```
┌─────────────────────────────────────────────────────┐
│ СЕКЦИЯ 1: Hero                                      │
│ ─────────────────────────────────────────────────   │
│ Источник данных: Sanity (hero collection)           │
│ Содержит: заголовок, подзаголовок, фото/видео, CTA  │
│ Логика: A/B тест через PostHog (вариант A/B)        │
│ Анимация: GSAP text stagger reveal при загрузке     │
│ Mobile: статичное фото вместо видео                 │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ СЕКЦИЯ 2: Marquee — бегущая строка                  │
│ ─────────────────────────────────────────────────   │
│ Данные: список коллекций из Sanity                  │
│ Логика: бесконечный loop, пауза при hover           │
│ Тип: Client Component (анимация)                    │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ СЕКЦИЯ 3: Product Spotlight                         │
│ ─────────────────────────────────────────────────   │
│ Данные: products WHERE featured = true LIMIT 6      │
│ Фильтр по статусу: только IN_STOCK и MADE_TO_ORDER  │
│ Сортировка: по полю featuredOrder ASC               │
│ Обновление: ISR каждые 60 минут                    │
│ Skeleton: пока грузится Suspense                   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ СЕКЦИЯ 4: Brand Story                               │
│ ─────────────────────────────────────────────────   │
│ Данные: Sanity (статичный контент)                  │
│ Видео: Cloudinary CDN, HLS стриминг                 │
│ Lazy load: видео загружается только при viewport    │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ СЕКЦИЯ 5: Materials (Horizontal Scroll)             │
│ ─────────────────────────────────────────────────   │
│ Данные: Sanity (3 панели: дерево, металл, ручная)   │
│ GSAP ScrollTrigger: pinning + horizontal движение   │
│ Mobile: вертикальные карточки вместо pin            │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ СЕКЦИЯ 6: Collections Grid                          │
│ ─────────────────────────────────────────────────   │
│ Данные: collections WHERE active = true LIMIT 4     │
│ Layout: asymmetric grid (1 большая + 3 маленьких)   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ СЕКЦИЯ 7: UGC Gallery                               │
│ ─────────────────────────────────────────────────   │
│ Данные: Sanity (curated UGC photos)                 │
│ Layout: CSS Masonry (columns)                       │
│ Взаимодействие: Lightbox при клике                  │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ СЕКЦИЯ 8: Newsletter                                │
│ ─────────────────────────────────────────────────   │
│ API: POST /api/newsletter (Resend)                  │
│ Валидация: Zod email schema                         │
│ State: success/error/loading                        │
│ Защита: rate limit 3 req/IP/hour (Upstash)          │
└─────────────────────────────────────────────────────┘
```

#### Связи с другими страницами

```
Главная → /catalog ................ кнопка "Весь каталог"
Главная → /product/[slug] ......... клик по Product Spotlight
Главная → /collections/[slug] ..... клик по Collections Grid
Главная → /about .................. ссылка в Brand Story
Главная → /blog ................... секция "Вдохновение" (опц.)
```

---

### 📦 Каталог /catalog (и подкатегории)

**Тип рендеринга:** SSR + Streaming (React Suspense)
**Данные:** Algolia (поиск/фильтры) + Prisma (детали товаров)

#### Параметры URL (Query Params)

```typescript
interface CatalogSearchParams {
  category?:   string          // 'furniture' | 'decor'
  subcategory?: string         // 'living-room' | 'bedroom' | ...
  material?:   string[]        // ['oak', 'walnut', 'metal']
  color?:      string[]        // ['light', 'dark', 'natural']
  priceMin?:   number          // 5000
  priceMax?:   number          // 500000
  size?:       string[]        // ['S', 'M', 'L', 'XL']
  inStock?:    boolean         // true
  sort?:       SortOption      // 'newest' | 'price_asc' | 'price_desc' | 'popular'
  page?:       number          // 1
  q?:          string          // поисковый запрос
}
```

#### Логика фильтрации

```
1. URL params парсятся в searchParams объект
2. searchParams → Algolia query (facetFilters + numericFilters)
3. Algolia возвращает: hits (товары) + facets (для фильтров) + nbHits (count)
4. Facets используются для отображения count в каждом фильтре
5. Пагинация: offset = (page - 1) * 24
6. При изменении фильтра: URL обновляется (nuqs), запрос к Algolia
7. SEO: параметры фильтров НЕ индексируются (rel=canonical без params)
```

#### Компоненты и их данные

```
CatalogPage (Server Component)
├── CategoryBreadcrumb .......... статичный, из params
├── CatalogHeader ............... название + count (из Algolia)
├── FilterSidebar (Client) ...... facets из Algolia
│   ├── CategoryFilter
│   ├── MaterialFilter (swatches)
│   ├── ColorFilter (swatches)
│   ├── PriceRangeFilter (slider)
│   ├── SizeFilter (buttons)
│   └── InStockToggle
├── SortSelect (Client) ......... локальный стейт
├── Suspense
│   └── ProductGrid (Server) .... hits из Algolia
│       └── ProductCard × N
│           ├── ProductImage (next/image)
│           ├── QuickViewButton (Client)
│           └── WishlistButton (Client, auth-aware)
└── Pagination .................. из Algolia nbPages
```

#### Состояния каталога

```
Loading:   Skeleton × 12 карточек
Empty:     "Ничего не найдено" + кнопка сбросить фильтры
Error:     "Ошибка загрузки" + retry
Filtered:  нормальная сетка с активными фильтрами
```

#### Связи

```
Каталог → /product/[slug] ......... клик по карточке
Каталог → /catalog/[category] ..... клик по категории в фильтре
Каталог → /cart ................... добавление из Quick View
Каталог ← /product/[slug] ......... хлебные крошки
Каталог ← Главная ................. кнопки CTA
Каталог ← Навигация ............... header ссылки
```

---

### 🛋️ Страница товара /product/[slug]

**Тип рендеринга:** SSG + ISR (revalidate: 300)
**Данные:** Prisma (товар) + Algolia (рекомендации) + Sanity (rich content)

#### Структура данных страницы

```typescript
interface ProductPageData {
  product: {
    id: string;
    slug: string;
    name: string;
    description: string;       // rich text из Sanity
    price: number;             // в копейках
    compareAtPrice?: number;   // зачёркнутая цена
    status: ProductStatus;
    images: ProductImage[];    // минимум 3, максимум 10
    variants: ProductVariant[]; // комбинации материал × цвет × размер
    specifications: Spec[];    // таблица характеристик
    careInstructions: string;  // уход
    category: Category;
    collection?: Collection;
    tags: string[];
    seoTitle?: string;
    seoDescription?: string;
    averageRating: number;
    reviewCount: number;
  };
  relatedProducts: Product[];  // 4-6 похожих
  reviews: Review[];           // первые 5
}
```

#### Логика вариантов товара

```
Вариант = комбинация: material × finish × size

Пример для стола Oslo:
  material: ['oak_light', 'oak_dark', 'walnut', 'ash']
  finish:   ['natural_oil', 'white_lacquer', 'dark_wax']
  size:     ['120x60', '140x70', '160x80', '180x90']

Логика выбора варианта:
1. Пользователь выбирает material → доступные finish обновляются
2. Пользователь выбирает finish → доступные size обновляются
3. При выборе варианта → главное фото меняется на фото этого варианта
4. Цена может меняться в зависимости от варианта
5. Наличие: каждый вариант имеет свой InStock статус
6. Недоступные варианты: показываются серыми с strike-through
```

#### Логика галереи

```
Desktop:
  - Главное фото слева (sticky, 55% ширины)
  - Миниатюры: вертикальный список справа от главного
  - Hover на главном фото → лупа-zoom (2x)
  - Клик → fullscreen lightbox (Framer Motion)

Mobile:
  - Горизонтальный swipe по фото
  - Dots навигация
  - Pinch-to-zoom на touch устройствах
  - Fullscreen при тапе

Количество фото:
  - Минимум 3: фронт, сбоку, детальный крупный план
  - Рекомендуется 6-8: все ракурсы + lifestyle
  - Видео 360° (опционально, этап 5)
```

#### Логика добавления в корзину

```
1. Пользователь выбирает все обязательные варианты
2. Если НЕ выбраны → кнопка disabled + подсказка
3. Клик "Добавить" →
   a. Проверка auth (если нет → сохраняем в localStorage + промпт входа)
   b. Optimistic update: счётчик корзины +1 мгновенно
   c. API: cart.addItem (tRPC mutation)
   d. Мини-корзина (sidebar) открывается
   e. Успех: кнопка меняется на "✓ В корзине"
   f. Ошибка: toast с сообщением + rollback
```

#### Логика отзывов

```
Отображение:
  - Агрегированный рейтинг (звёзды + число отзывов)
  - Distribution bar (сколько 5★, 4★ и т.д.)
  - Список отзывов (10 за раз, пагинация)
  - Фото к отзывам (если есть)
  - Верифицированная покупка (бейдж)

Написание отзыва:
  - Только авторизованный пользователь
  - Только после факта покупки этого товара (проверка по orders)
  - Оценка 1-5 + текст + опциональные фото (до 3)
  - Модерация: сначала статус PENDING, после проверки PUBLISHED
```

#### Связи страницы товара

```
Товар → /cart ..................... "Добавить в корзину"
Товар → /catalog/[category] ....... хлебные крошки
Товар → /collections/[slug] ....... ссылка на коллекцию
Товар ← /catalog .................. клик по карточке
Товар ← /collections/[slug] ....... клик по товару коллекции
Товар ← Главная ................... Product Spotlight
Товар ← /cart ..................... клик по товару в корзине
Товар ← /account/orders/[id] ...... повторить заказ
Товар ← Email (order confirm) ..... ссылка на купленный товар
```

---

### 🎨 Коллекции /collections/[slug]

**Тип рендеринга:** SSG (generateStaticParams) + ISR: 3600
**Данные:** Sanity (концепция) + Prisma (товары коллекции)

#### Структура страницы

```
Hero коллекции (fullscreen фото + название)
  ↓
Editorial текст (история, вдохновение, дизайнер)
  ↓
Lookbook (masonry gallery — товары в интерьере)
  ↓
Список товаров коллекции (сетка карточек)
  ↓
"Смотреть все" → /catalog?collection=[slug]
```

---

### 🛒 Корзина /cart

**Тип рендеринга:** CSR (Client Component)
**Данные:** Zustand store + Supabase (sync для авторизованных)

#### Логика корзины

```typescript
// Структура корзины
interface CartState {
  items: CartItem[];
  couponCode?: string;
  couponDiscount?: number;
  shippingMethod?: ShippingMethod;
}

interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
  // Snapshot цены на момент добавления:
  priceSnapshot: number;
  // Актуальная цена (может отличаться):
  currentPrice: number;
  priceChanged: boolean; // флаг если цена изменилась
}
```

#### Сценарии изменения цены

```
При открытии корзины → сверяем snapshot с актуальной ценой
Если цена выросла:
  → Показываем предупреждение: "Цена на [товар] изменилась"
  → Обновляем до актуальной
Если цена упала:
  → Автоматически обновляем (пользователь доволен)
Если товар стал недоступен:
  → Серый бейдж "Нет в наличии", кнопка удалить
```

#### Расчёт итогов

```
Subtotal = Σ (item.currentPrice × item.quantity)
Discount = couponCode valid → percentage или fixed
  → MAX скидка = 30% (бизнес-правило)
Shipping = по выбранному методу (или бесплатно от 50 000 ₽)
Total = Subtotal - Discount + Shipping
```

#### Промокоды — логика

```
1. Пользователь вводит код → debounce 500ms
2. POST /api/coupons/validate { code, cartSubtotal }
3. Сервер: проверяет код в БД
   - Активен ли (isActive = true)
   - Не истёк ли (expiresAt > now)
   - Не достигнут ли лимит использований
   - Подходит ли под минимальную сумму
   - Не использован ли этим пользователем ранее
4. Ответ: { valid, discount, type, message }
5. Применяем или показываем ошибку
```

#### Связи корзины

```
Корзина → /checkout ............... "Оформить заказ"
Корзина → /product/[slug] ......... клик по товару
Корзина → /catalog ................ "Продолжить покупки"
Корзина ← /product/[slug] ......... "Добавить в корзину"
Корзина ← мини-корзина (header) ... везде на сайте
```

---

### 💳 Checkout /checkout

**Тип рендеринга:** CSR (protected route)
**Auth:** обязательна перед входом
**Данные:** Zustand (cart) + Stripe + Prisma (создание заказа)

#### Шаги и логика

```
ШАГ 1: /checkout — Контактные данные
─────────────────────────────────────
Поля: firstName, lastName, email, phone
Предзаполнение: из Clerk user profile
Валидация: Zod
  - email: valid format
  - phone: +7 (xxx) xxx-xx-xx (RU) или международный
  - firstName/lastName: мин. 2 символа

ШАГ 2: /checkout/delivery — Доставка
─────────────────────────────────────
Варианты доставки:
  - Курьер по Москве: 1-2 дня, фиксированная цена
  - СДЭК: 3-7 дней, рассчитывается по весу и адресу
  - Самовывоз: бесплатно, адрес склада
  - Грузовая (для крупных товаров): согласование

Адрес:
  - Автодополнение через Dadata API
  - Сохранить адрес (checkbox) → /account/addresses
  - Если есть сохранённые → выпадающий список

Логика расчёта:
  - Вес заказа = Σ (item.weight × quantity)
  - Если вес > 50кг → только грузовая доставка
  - Если сумма > 50 000 ₽ → курьер бесплатно

ШАГ 3: /checkout/payment — Оплата
──────────────────────────────────
Stripe Elements (встроенная форма)
Apple Pay / Google Pay (если доступно)
  → Проверяется: window.ApplePaySession или PaymentRequest API

Процесс оплаты:
1. Создаём order в БД (статус: PENDING)
2. Создаём Stripe PaymentIntent
3. Получаем client_secret
4. Stripe Elements → confirmPayment
5. Stripe redirect → /checkout/success?payment_intent=pi_xxx
6. На success странице: verifyPayment → обновляем order статус

Ошибки оплаты:
  - card_declined → "Карта отклонена, попробуйте другую"
  - insufficient_funds → "Недостаточно средств"
  - expired_card → "Срок карты истёк"
  - generic → "Ошибка оплаты, обратитесь в банк"
```

#### Webhook /api/webhooks/stripe

```
События которые обрабатываем:
  payment_intent.succeeded
    → order.status = PAID
    → Отправить email подтверждение (Resend)
    → Списать товар со склада (inventory)
    → Уведомить менеджера (опционально)
  
  payment_intent.payment_failed
    → order.status = PAYMENT_FAILED
    → Email пользователю
  
  charge.dispute.created
    → Уведомить команду (Slack webhook)
```

---

### ✅ Успешный заказ /checkout/success

**Тип рендеринга:** CSR
**Данные:** Stripe PaymentIntent + order из БД

#### Логика страницы

```
1. Получаем payment_intent из URL params
2. Верифицируем через Stripe API (защита от прямого доступа)
3. Находим order по payment_intent_id
4. Очищаем корзину (Zustand + Supabase)
5. Отправляем PostHog event: "purchase_completed"

Отображаем:
  - Анимация успеха (confetti или elegant reveal)
  - Номер заказа
  - Список товаров
  - Адрес доставки
  - Ожидаемая дата доставки
  - "Следить за заказом" → /account/orders/[id]
```

---

### 👤 Аккаунт /account/*

**Тип рендеринга:** CSR (все страницы защищены)
**Auth:** redirect → /auth/sign-in если не авторизован

#### /account/orders — Список заказов

```
Данные: orders WHERE userId = currentUser
Поля: номер, дата, сумма, статус, превью товаров

Статусы заказов:
  PENDING        → "Ожидает подтверждения"   🟡
  CONFIRMED      → "Подтверждён"             🟢
  PROCESSING     → "В обработке"             🔵
  SHIPPED        → "Отправлен"               🔵
  DELIVERED      → "Доставлен"               🟢
  CANCELLED      → "Отменён"                 🔴
  REFUNDED       → "Возврат"                 ⚪

Действия:
  - "Повторить заказ" → добавить все товары в корзину
  - "Отслеживать" → ссылка на трекинг СДЭК/курьера
  - "Отменить" (если PENDING или CONFIRMED)
  - "Вернуть" (если DELIVERED, < 30 дней)
```

#### /account/orders/[id] — Детали заказа

```
Полная информация:
  - Статус с историей изменений (timeline)
  - Список товаров с фото
  - Адрес доставки
  - Способ оплаты (последние 4 цифры)
  - Сумма с разбивкой
  - Трекинг номер + ссылка
  - Кнопка "Написать в поддержку"
  - Кнопка "Оставить отзыв" (для каждого товара)
```

#### /account/wishlist — Вишлист

```
Данные: wishlistItems WHERE userId = currentUser
  JOIN products (актуальные данные)

Функции:
  - Сетка товаров (как в каталоге)
  - Удалить из вишлиста
  - Переместить в корзину
  - Поделиться вишлистом (публичная ссылка /wishlist/[token])
  - Уведомление: "Цена снизилась!" (если цена упала с момента добавления)
```

---

### 🔐 Аутентификация /auth/*

**Провайдер:** Clerk
**Тип:** CSR (Clerk компоненты)

#### Логика входа/регистрации

```
/auth/sign-in:
  Методы: Email+Password / Google OAuth / Apple OAuth
  После входа: redirect → returnUrl или '/'
  Помни меня: 30 дней сессия

/auth/sign-up:
  1. Email + пароль (или OAuth)
  2. Верификация email (Clerk отправляет код)
  3. Опционально: имя и телефон
  4. После регистрации: sync с Prisma (webhook /api/webhooks/clerk)
     → создаём User запись в нашей БД
  5. Redirect → '/' или returnUrl

Clerk Webhook → создание пользователя в нашей БД:
  event: "user.created"
  → prisma.user.create({
      clerkId: event.data.id,
      email: event.data.email_addresses[0].email_address,
      ...
    })
```

---

### 📝 Блог /blog/[slug]

**Тип рендеринга:** SSG (generateStaticParams) + ISR: 86400
**Данные:** Sanity CMS

#### Структура статьи

```
Hero фото (fullwidth)
Заголовок + дата + автор + время чтения
Rich text контент (Portable Text)
  - Параграфы
  - Заголовки H2/H3
  - Изображения с подписями
  - Цитаты
  - Встроенные карточки товаров (Product Card inline)
Теги
Связанные статьи
CTA: "Посмотреть коллекцию" → /collections/[slug]
```

---

## 4. Потоки данных и API

### Схема потоков данных

```
                    ┌─────────────────┐
                    │   Sanity CMS    │ ← Контент-менеджер
                    │  (Контент/SEO)  │
                    └────────┬────────┘
                             │ GROQ query
                    ┌────────▼────────┐
                    │                 │
       ┌────────────►  Next.js App   ◄────────────────┐
       │            │   (Верхний     │                │
       │            │    слой)       │                │
       │            └────────┬───────┘                │
       │                     │                        │
  ┌────┴────┐      ┌─────────▼────────┐      ┌───────┴──────┐
  │ Algolia │      │   tRPC Router    │      │   Stripe     │
  │(Поиск)  │      │ (Бизнес-логика) │      │  (Оплата)    │
  └─────────┘      └─────────┬────────┘      └──────────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
       ┌──────▼──────┐ ┌────▼────┐  ┌─────▼──────┐
       │  PostgreSQL  │ │ Redis   │  │ Cloudinary │
       │  (Supabase) │ │(Upstash)│  │  (Медиа)   │
       └─────────────┘ └─────────┘  └────────────┘
```

### tRPC Роутеры и эндпоинты

```typescript
// Полная карта tRPC процедур

appRouter = {
  products: {
    getById:         publicProcedure  // input: { id | slug }
    getMany:         publicProcedure  // input: CatalogParams
    getFeatured:     publicProcedure  // для главной страницы
    getRelated:      publicProcedure  // input: { productId, limit }
    getByCollection: publicProcedure  // input: { collectionSlug }
    search:          publicProcedure  // input: { q } → Algolia
  },

  categories: {
    getAll:          publicProcedure  // дерево категорий
    getBySlug:       publicProcedure  // input: { slug }
  },

  collections: {
    getAll:          publicProcedure
    getBySlug:       publicProcedure  // input: { slug }
  },

  cart: {
    get:             protectedProcedure
    addItem:         protectedProcedure  // input: { productId, variantId, qty }
    updateItem:      protectedProcedure  // input: { itemId, qty }
    removeItem:      protectedProcedure  // input: { itemId }
    clear:           protectedProcedure
    applyCoupon:     protectedProcedure  // input: { code }
    removeCoupon:    protectedProcedure
  },

  wishlist: {
    get:             protectedProcedure
    toggle:          protectedProcedure  // input: { productId }
    isInWishlist:    protectedProcedure  // input: { productId }
    moveToCart:      protectedProcedure  // input: { productId }
    getPublic:       publicProcedure     // input: { token }
  },

  orders: {
    create:          protectedProcedure  // создание из корзины
    getById:         protectedProcedure  // input: { id }
    getMyOrders:     protectedProcedure  // список + пагинация
    cancel:          protectedProcedure  // input: { id }
    reorder:         protectedProcedure  // input: { id } → add to cart
  },

  checkout: {
    createIntent:    protectedProcedure  // → Stripe PaymentIntent
    calculateShipping: protectedProcedure // input: { address, cartId }
    validateAddress: protectedProcedure  // Dadata API
  },

  reviews: {
    getByProduct:    publicProcedure     // input: { productId, page }
    create:          protectedProcedure  // input: { productId, rating, text, photos }
    canReview:       protectedProcedure  // input: { productId } → bool
  },

  users: {
    getProfile:      protectedProcedure
    updateProfile:   protectedProcedure
    getAddresses:    protectedProcedure
    addAddress:      protectedProcedure
    updateAddress:   protectedProcedure
    deleteAddress:   protectedProcedure
    setDefaultAddress: protectedProcedure
  },

  coupons: {
    validate:        protectedProcedure  // input: { code, subtotal }
  },

  newsletter: {
    subscribe:       publicProcedure     // input: { email }
  },
}
```

### Algolia Index Structure

```javascript
// Index: products
{
  objectID: "prod_xxx",
  name: "Oslo Coffee Table",
  slug: "oslo-coffee-table",
  price: 125000,
  compareAtPrice: 150000,
  status: "in_stock",

  // Facets для фильтрации
  category: "furniture",
  subcategory: "living_room",
  collection: "nordic",
  materials: ["oak", "metal"],
  colors: ["light", "natural"],
  sizes: ["M", "L", "XL"],
  inStock: true,

  // Для сортировки
  createdAt: 1700000000,
  salesCount: 48,
  averageRating: 4.7,
  featuredScore: 95,

  // Для отображения
  mainImage: "https://cdn.cloudinary.com/...",
  shortDescription: "Минималистичный журнальный стол...",
}

// Replica индексы для сортировок:
products_price_asc     → sortBy: price ASC
products_price_desc    → sortBy: price DESC
products_newest        → sortBy: createdAt DESC
products_popular       → sortBy: salesCount DESC
```

### Supabase Real-time Subscriptions

```typescript
// Для страницы заказа — real-time обновление статуса
const subscription = supabase
  .channel('order_status')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'orders',
    filter: `id=eq.${orderId}`,
  }, (payload) => {
    // Обновляем UI без перезагрузки
    setOrderStatus(payload.new.status);
  })
  .subscribe();
```

---

## 5. Бизнес-логика и правила

### Инвентаризация (Inventory)

```
Структура:
  Product → has many → ProductVariant
  ProductVariant → has one → Inventory { quantity, reserved }

  available = quantity - reserved

При добавлении в корзину:
  inventory.reserved += qty  (soft reserve, 30 мин)

При оплате:
  inventory.quantity -= qty
  inventory.reserved -= qty

При истечении резерва (cron каждые 5 мин):
  IF reserved_at < now - 30min → inventory.reserved -= qty
  Уведомить пользователя: "Товар освобождён из корзины"

Пороги уведомлений:
  quantity <= 3 → показываем "Осталось 3 штуки"
  quantity = 0 → статус OUT_OF_STOCK
  Уведомить менеджера (email/Slack) если quantity < 5
```

### Ценообразование

```
Базовые правила:
  - Цена хранится в копейках (Integer), никогда Float
  - НДС включён в цену (20%)
  - Отображение: price / 100, форматирование Intl.NumberFormat

Скидки:
  compareAtPrice > price → показываем strike-through и badge "−X%"
  Максимальная скидка по промокоду: 30%
  Нельзя применить промокод к уже скидочным товарам (configurable)

Динамическое ценообразование (этап 5):
  Цена может меняться в зависимости от спроса (A/B тест)
```

### Лимиты и ограничения

```
Корзина:
  MAX_ITEMS_PER_CART = 20 (разных позиций)
  MAX_QTY_PER_ITEM = 10
  CART_EXPIRY = 7 days (неавторизованный), 30 days (авторизованный)

Отзывы:
  Один отзыв на один товар на одного пользователя
  Минимальная длина: 20 символов
  Максимум фото к отзыву: 3

Rate Limiting (Upstash):
  Newsletter: 3 req / IP / hour
  Auth attempts: 10 req / IP / 15 min
  Add to cart: 30 req / user / min
  API общий: 100 req / IP / min
```

### Email уведомления (Resend)

```
Триггеры:
  1. Регистрация → Welcome email
  2. Заказ создан → Order Confirmation
  3. Заказ отправлен → Shipping Notification + трекинг
  4. Заказ доставлен → Delivery + запрос отзыва (через 3 дня)
  5. Цена снизилась на wishlist товар → Price Drop Alert
  6. Товар появился в наличии → Back in Stock
  7. Брошенная корзина → Abandoned Cart (через 1 час, затем 24 часа)
  8. Восстановление пароля → Reset Password

Шаблоны: React Email (HTML компоненты)
Очередь: Upstash QStash (надёжная доставка)
```

---

## 6. Состояние приложения

### Zustand Stores

```typescript
// store/cart.ts — корзина
interface CartStore {
  items: CartItem[];
  coupon: Coupon | null;
  isOpen: boolean;           // мини-корзина открыта?

  // Actions
  addItem: (item: AddItemInput) => Promise<void>;
  updateQty: (itemId: string, qty: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  clear: () => void;
  toggleCart: () => void;

  // Computed
  subtotal: number;
  discount: number;
  total: number;
  itemCount: number;
}

// store/wishlist.ts — список желаний
interface WishlistStore {
  productIds: string[];
  toggle: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  sync: () => Promise<void>;  // синхронизация с сервером
}

// store/ui.ts — UI состояние
interface UIStore {
  searchOpen: boolean;
  mobileMenuOpen: boolean;
  activeModal: string | null;
  toasts: Toast[];

  openSearch: () => void;
  closeSearch: () => void;
  toggleMobileMenu: () => void;
  openModal: (id: string) => void;
  closeModal: () => void;
  addToast: (toast: Toast) => void;
  removeToast: (id: string) => void;
}
```

### Синхронизация корзины

```
Неавторизованный пользователь:
  Корзина → localStorage (гостевая корзина)
  При авторизации → merge с серверной корзиной
    → если конфликт (один и тот же товар): берём большее количество

Авторизованный пользователь:
  Корзина → Supabase (персистентность)
  При открытии страницы → sync с сервером
  При изменении → optimistic update + sync
```

---

## 7. SEO-стратегия

### Метаданные по страницам

```typescript
// app/(marketing)/page.tsx
export const metadata: Metadata = {
  title: 'Wood & Metal — Дизайнерская мебель из дерева и декор',
  description: 'Авторская мебель ручной работы из массива дерева...',
  openGraph: { images: ['/og-home.jpg'] },
};

// app/(marketing)/product/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct(params.slug);
  return {
    title: `${product.name} — купить в Wood & Metal`,
    description: product.seoDescription || product.description.slice(0, 160),
    openGraph: {
      images: [product.images[0].url],
      type: 'website',
    },
  };
}
```

### Структурированные данные (JSON-LD)

```typescript
// На странице товара:
{
  "@type": "Product",
  "name": product.name,
  "description": product.description,
  "image": product.images.map(i => i.url),
  "brand": { "@type": "Brand", "name": "Wood & Metal" },
  "offers": {
    "@type": "Offer",
    "price": product.price / 100,
    "priceCurrency": "RUB",
    "availability": product.status === 'IN_STOCK'
      ? "InStock" : "OutOfStock",
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": product.averageRating,
    "reviewCount": product.reviewCount,
  }
}

// На странице каталога:
{ "@type": "ItemList", "itemListElement": [...products] }

// На главной:
{ "@type": "Organization", "name": "Wood & Metal", ... }
```

### Индексация

```
Индексируются (robots: index, follow):
  /
  /catalog/[category]
  /catalog/[category]/[subcategory]
  /product/[slug]
  /collections/[slug]
  /about/*
  /blog/[slug]

НЕ индексируются (robots: noindex):
  /catalog?* (фильтры через query params)
  /cart
  /checkout/*
  /account/*
  /auth/*
  /api/*

Canonical:
  /catalog?material=oak&price=50000 → canonical: /catalog
  Динамические страницы → canonical: текущий URL
```

### Sitemap

```
Генерация: next-sitemap (при build)
Обновление: ISR revalidation при изменении контента

sitemap.xml содержит:
  / (changefreq: weekly, priority: 1.0)
  /catalog/* (changefreq: daily, priority: 0.8)
  /product/* (changefreq: weekly, priority: 0.9)
  /collections/* (changefreq: weekly, priority: 0.7)
  /blog/* (changefreq: monthly, priority: 0.6)
  /about/* (changefreq: monthly, priority: 0.5)
```

---

## 8. Расписание разработки

### ФАЗА 1 — Фундамент (Недели 1–3)

```
Неделя 1: Инфраструктура
─────────────────────────
ПН: Инициализация монорепо (Turborepo + pnpm)
    Next.js 14 App Router + TypeScript strict
ВТ: Tailwind + дизайн-токены в tailwind.config
    globals.css (шрифты, CSS переменные)
СР: Prisma схема v1 (Product, Category, User, Order)
    Supabase проект + подключение
ЧТ: Clerk аутентификация + middleware
    /api/webhooks/clerk (sync users)
ПТ: GitHub Actions CI/CD → Vercel
    Environments: dev / preview / production

Неделя 2: Базовые компоненты
──────────────────────────────
ПН: Button, Badge, Input, Skeleton, Avatar
ВТ: Header + Navigation (desktop)
    Footer
СР: shadcn/ui: Dialog, Sheet, Dropdown, Toast
ЧТ: tRPC setup (server + client + React Query)
    Базовый appRouter
ПТ: Sanity studio + схемы контента
    Подключение next-sanity

Неделя 3: Данные и поиск
──────────────────────────
ПН: Algolia индексация товаров
    Prisma seed script (тестовые данные)
ВТ: products.getMany tRPC процедура (с пагинацией)
    products.getById / getBySlug
СР: Zustand store: cart + wishlist + ui
    Синхронизация корзины с Supabase
ЧТ: Cloudinary upload preset + next/image config
    ProductImage компонент
ПТ: Тесты: unit для utils, schema validation
    E2E smoke test (Playwright)

Deliverable Фазы 1: Рабочий скелет, БД, auth, компоненты
```

---

### ФАЗА 2 — Ключевые страницы (Недели 4–7)

```
Неделя 4: Главная страница
────────────────────────────
ПН: Hero секция (Server Component + GSAP анимации)
ВТ: Marquee компонент (Framer Motion)
СР: Product Spotlight (ISR, Suspense + Skeleton)
ЧТ: Collections Grid
    Brand Story секция
ПТ: Materials Horizontal Scroll (GSAP ScrollTrigger)
    Lenis smooth scroll интеграция

Неделя 5: Каталог — часть 1
──────────────────────────────
ПН: Каталог layout (сетка + sidebar)
ВТ: FilterSidebar: CategoryFilter, MaterialFilter
    PriceRangeFilter (двойной слайдер)
СР: SortSelect + ActiveFilters (показ активных фильтров)
ЧТ: URL sync (nuqs library)
    Algolia InstantSearch интеграция
ПТ: Skeleton loading для каталога
    Empty state, Error state

Неделя 6: Каталог — часть 2
──────────────────────────────
ПН: ProductCard (hover эффекты, Wishlist button)
ВТ: QuickView Modal (Radix Dialog + Product info)
СР: ProductGrid (Suspense + виртуализация для больших списков)
ЧТ: Пагинация
    Мобильный FilterSheet (Bottom Sheet)
ПТ: Страница категории (breadcrumbs, SEO metadata)
    Тесты каталога

Неделя 7: Страница товара
───────────────────────────
ПН: Галерея (main image + thumbnails + zoom)
ВТ: Конфигуратор вариантов (material × finish × size)
    Логика доступности вариантов
СР: Tabs (Описание / Характеристики / Уход)
    AddToCart логика + мини-корзина
ЧТ: RelatedProducts (Algolia recommendations)
    Reviews display (list + aggregate rating)
ПТ: Lightbox (fullscreen галерея)
    SSG + ISR setup, generateStaticParams
    Тесты страницы товара

Deliverable Фазы 2: Главная + Каталог + Страница товара
```

---

### ФАЗА 3 — Purchase Flow (Недели 8–10)

```
Неделя 8: Корзина
───────────────────
ПН: Страница /cart (CartItem список)
ВТ: Расчёт итогов (subtotal, discount, shipping, total)
СР: Промокоды (validate + apply + error states)
    Логика изменения цены (price snapshot vs current)
ЧТ: Мини-корзина (Header Drawer, Framer Motion)
    Sync корзины при авторизации
ПТ: Удаление товара, изменение количества
    Пустая корзина (empty state + CTA)

Неделя 9: Checkout
──────────────────
ПН: Checkout layout (progress bar + order summary)
    Шаг 1: форма контактных данных (Zod validation)
ВТ: Шаг 2: доставка + расчёт стоимости
    Dadata API (автодополнение адреса)
СР: Stripe Elements интеграция
    createPaymentIntent tRPC
ЧТ: Apple Pay / Google Pay (Payment Request API)
    Страница успеха (/checkout/success)
ПТ: Stripe webhook handler
    Email: Order Confirmation (React Email + Resend)

Неделя 10: Email и Уведомления
───────────────────────────────
ПН: React Email шаблоны: Welcome, Order Confirm
ВТ: Shipping Notification, Delivery + Review Request
СР: Price Drop Alert, Back in Stock
ЧТ: Abandoned Cart логика (Upstash QStash jobs)
ПТ: E2E тесты: полный checkout flow
    Тесты webhook handler

Deliverable Фазы 3: Полный purchase flow
```

---

### ФАЗА 4 — Продакшн (Недели 11–13)

```
Неделя 11: Личный кабинет
───────────────────────────
ПН: /account layout (sidebar + protected routes)
ВТ: /account/orders (список с пагинацией)
    /account/orders/[id] (детали + timeline)
СР: /account/wishlist (сетка + действия)
    Публичный wishlist (/wishlist/[token])
ЧТ: /account/profile (редактирование)
    /account/addresses (CRUD адресов)
ПТ: Reviews creation flow
    Отмена заказа, повторный заказ

Неделя 12: SEO, CMS, Аналитика
─────────────────────────────────
ПН: generateMetadata для всех страниц
    JSON-LD структурированные данные
ВТ: Sitemap generation + robots.txt
    Canonical tags
СР: Sanity integration (главная, коллекции, блог)
    /blog/ + /blog/[slug] страницы
ЧТ: PostHog аналитика (events, funnels)
    Sentry error tracking (frontend + backend)
ПТ: Lighthouse CI (цель: 90+)
    Оптимизация: bundle analyzer, image audit

Неделя 13: Тестирование и полировка
─────────────────────────────────────
ПН: E2E тесты: все критические пути
ВТ: Регрессионное тестирование
СР: Accessibility audit (axe-core)
    WCAG 2.1 AA compliance
ЧТ: Load testing (k6) — симуляция 100 concurrent users
ПТ: Bug fixes, code review, documentation

Deliverable Фазы 4: Production-ready сайт
```

---

### ФАЗА 5 — Расширение (Недели 14–16)

```
Неделя 14: 3D и AR
────────────────────
ПН-СР: Three.js / React Three Fiber — 3D превью товара
ЧТ-ПТ: WebXR API — AR просмотр в интерьере

Неделя 15: Оптимизация
───────────────────────
ПН: A/B тесты через PostHog (Hero вариации)
ВТ: PWA манифест + Service Worker (offline catalog)
СР: Infinite scroll вместо пагинации (опционально)
ЧТ: Мультиязычность (next-intl, EN + RU)
ПТ: Performance budget enforcement

Неделя 16: B2B и масштабирование
──────────────────────────────────
ПН-СР: B2B аккаунты (оптовые цены, проекты)
ЧТ-ПТ: Маркетплейс foundation (Stripe Connect)

Deliverable Фазы 5: Advanced features
```

---

## 9. Матрица связей страниц

### Навигационные связи

```
ОТ → К                          ТИП СВЯЗИ              ТРИГГЕР
──────────────────────────────────────────────────────────────────
/ → /catalog                    Навигация              Кнопка / Header
/ → /product/[slug]             Deep link              Product card click
/ → /collections/[slug]         Навигация              Collections section
/catalog → /product/[slug]      Основной flow          Card click
/catalog → /catalog/[cat]       Фильтрация             Category filter
/product → /cart                Покупка                Add to cart
/product → /catalog/[cat]       Breadcrumb             Link
/product → /collections/[slug]  Cross-link             Collection badge
/cart → /checkout               Purchase               Checkout button
/cart → /product/[slug]         Back link              Item click
/cart → /catalog                Continue shopping      CTA
/checkout → /auth/sign-in       Auth gate              Not logged in
/checkout → /checkout/success   Happy path             Payment success
/checkout/success → /account    Post-purchase          Order tracking
/account → /product/[slug]      Re-order               Order history
/auth/sign-in → returnUrl       Post-auth              Redirect
```

### API-зависимости страниц

```
СТРАНИЦА              PRISMA    ALGOLIA   SANITY    STRIPE    CLERK
──────────────────────────────────────────────────────────────────
/                         ✓                  ✓
/catalog                  ✓         ✓
/product/[slug]           ✓         ✓         ✓
/collections/[slug]       ✓                   ✓
/cart                     ✓
/checkout                 ✓                             ✓
/checkout/success         ✓                             ✓
/account/*                ✓                                       ✓
/auth/*                                                           ✓
/blog/[slug]                                  ✓
```

### Критические пути (никогда не должны падать)

```
1. / → /product/[slug] → /cart → /checkout → /checkout/success
   Это основной revenue path. SLA: 99.9%

2. /auth/sign-in → /checkout
   Блокирует покупку. SLA: 99.9%

3. Stripe webhook обработка
   Потеря webhook = потеря заказа. SLA: 99.99%

4. /api/trpc/cart.*
   Все cart мутации. Fallback: localStorage если сервер недоступен
```

---

*Версия документа: 1.0*
*Обновляй при каждом изменении архитектуры.*
*При конфликте с AGENTS.md — этот файл в приоритете по архитектурным решениям.*
