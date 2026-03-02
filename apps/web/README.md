# Wood & Metal Shop

Премиальный интернет-магазин дизайнерской мебели из дерева и металлического декора.

## Стек технологий

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite (production ready for PostgreSQL)
- **Authentication**: JWT с middleware защитой
- **Payments**: Stripe
- **Email**: Resend
- **Analytics**: PostHog
- **Animations**: GSAP, Framer Motion
- **Package Manager**: pnpm

## Разработка

### Установка

```bash
# Установка зависимостей
pnpm install

# Генерация Prisma Client
cd packages/db && npx prisma generate

# Применение миграций
cd packages/db && npx prisma db push
```

### Переменные окружения

Скопируйте `.env.example` в `.env.local` и заполните значения:

```bash
cp .env.example .env.local
```

Обязательные переменные:
- `DATABASE_URL` - строка подключения к базе данных
- `AUTH_SECRET` - секрет для JWT токенов
- `STRIPE_SECRET_KEY` - секретный ключ Stripe
- `RESEND_API_KEY` - API ключ для email уведомлений

### Запуск

```bash
# Разработка
pnpm dev

# Сборка
pnpm build

# Production
pnpm start
```

## Деплой

### Vercel (рекомендуется)

1. Подключите репозиторий к Vercel
2. Настройте переменные окружения в Vercel Dashboard
3. Разверните проект

### Переменные окружения для production

```bash
# Database (PostgreSQL для production)
DATABASE_URL="postgresql://user:password@host:port/database"

# Authentication
AUTH_SECRET="your-super-secret-key-min-32-chars"

# Stripe
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."

# Email
RESEND_API_KEY="re_..."

# Analytics
NEXT_PUBLIC_POSTHOG_KEY="phc_..."

# Environment
NODE_ENV="production"
```

### База данных

Для production используйте PostgreSQL:

1. Создайте базу данных в PostgreSQL
2. Обновите `DATABASE_URL` в переменных окружения
3. Примените миграции: `npx prisma db push`

### Stripe Webhook

1. В Stripe Dashboard создайте webhook endpoint
2. URL: `https://yourdomain.com/api/webhooks/stripe`
3. События: `checkout.session.completed`, `payment_intent.succeeded`
4. Скопируйте signing secret в `STRIPE_WEBHOOK_SECRET`

## Структура проекта

```
apps/web/
├── app/                    # Next.js App Router
│   ├── (marketing)/        # Публичные страницы
│   ├── (account)/          # Личный кабинет
│   ├── (checkout)/         # Оформление заказа
│   ├── admin/              # Админ панель
│   └── api/                # API маршруты
├── components/             # React компоненты
├── lib/                   # Утилиты и клиенты
├── store/                 # Zustand store
└── styles/                # Глобальные стили
```

## Функционал

- ✅ Каталог товаров с категориями
- ✅ Поиск и фильтрация
- ✅ Корзина с Zustand store
- ✅ Оформление заказа через Stripe
- ✅ Аутентификация пользователей
- ✅ Личный кабинет с историей заказов
- ✅ Wishlist с сохранением в БД
- ✅ Email уведомления
- ✅ Админ панель
- ✅ Адаптивный дизайн
- ✅ Анимации и micro-interactions

## Лицензия

MIT
