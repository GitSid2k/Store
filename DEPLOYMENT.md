# Деплой Wood & Metal Shop

## Подготовка к деплою

### 1. Переменные окружения

В Vercel Dashboard добавьте следующие переменные:

```bash
# Database (PostgreSQL для production)
DATABASE_URL="postgresql://user:password@host:port/database"

# Authentication
AUTH_SECRET="your-super-secret-key-min-32-chars-random-string"

# Admin
ADMIN_KEY="your-admin-secret-key"

# Stripe (Live keys для production)
STRIPE_SECRET_KEY="sk_live_xxxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxxx"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_xxxxx"

# Email (Resend)
RESEND_API_KEY="re_xxxxx"

# Analytics (PostHog)
NEXT_PUBLIC_POSTHOG_KEY="phc_xxxxx"

# Environment
NODE_ENV="production"
```

### 2. База данных PostgreSQL

#### Вариант A: Vercel Postgres
1. В Vercel Dashboard создайте Postgres базу данных
2. Скопируйте `DATABASE_URL` в переменные окружения
3. Примените схему: `npx prisma db push`

#### Вариант B: Supabase
1. Создайте проект на supabase.com
2. Скопируйте connection string из настроек
3. Добавьте в `DATABASE_URL`

#### Вариант C: Railway/PlanetScale/Neon
Аналогично - создайте базу, получите connection string

### 3. Stripe Webhook

1. Откройте Stripe Dashboard → Webhooks
2. Добавьте endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Выберите события:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
4. Скопируйте signing secret в `STRIPE_WEBHOOK_SECRET`

### 4. Resend Email

1. Создайте аккаунт на resend.com
2. Получите API ключ
3. Добавьте в `RESEND_API_KEY`
4. Для production верифицируйте домен

### 5. PostHog Analytics

1. Создайте проект на posthog.com
2. Скопируйте API ключ
3. Добавьте в `NEXT_PUBLIC_POSTHOG_KEY`

## Деплой на Vercel

### Через Vercel CLI

```bash
# Установка Vercel CLI
npm i -g vercel

# Логин
vercel login

# Деплой
vercel --prod
```

### Через GitHub

1. Загрузите код на GitHub
2. В Vercel Dashboard импортируйте репозиторий
3. Настройте переменные окружения
4. Разверните проект

## После деплоя

### Проверка работоспособности

1. **Главная страница** - открывается без ошибок
2. **Каталог** - товары отображаются
3. **Регистрация/Логин** - работает аутентификация
4. **Корзина** - добавление товаров
5. **Checkout** - редирект на Stripe
6. **Webhook** - заказы создаются после оплаты
7. **Email** - уведомления приходят

### Мониторинг

- **Vercel Logs** - ошибки и логи
- **Stripe Dashboard** - платежи
- **PostHog** - аналитика пользователей
- **Resend Dashboard** - статус email

### Миграция данных

Если есть данные для переноса:

```bash
# Экспорт из SQLite
cd packages/db
npx prisma db pull
npx prisma db seed

# Или используйте Prisma Migrate
npx prisma migrate dev --name init
npx prisma migrate deploy
```

## Troubleshooting

### Ошибка "Prisma Client not found"
```bash
# Добавьте в build settings Vercel:
pnpm install && cd packages/db && npx prisma generate
```

### Ошибка "Database connection failed"
- Проверьте `DATABASE_URL`
- Убедитесь, что база доступна извне
- Проверьте SSL настройки

### Stripe webhook не работает
- Проверьте `STRIPE_WEBHOOK_SECRET`
- Убедитесь, что endpoint публично доступен
- Проверьте логи Stripe Dashboard

### Email не отправляются
- Проверьте `RESEND_API_KEY`
- Для production верифицируйте домен
- Проверьте логи Resend Dashboard

## Production Checklist

- [ ] База данных PostgreSQL настроена
- [ ] Все переменные окружения добавлены
- [ ] Stripe live ключи установлены
- [ ] Webhook настроен и работает
- [ ] Email домен верифицирован
- [ ] PostHog аналитика работает
- [ ] HTTPS включен (автоматически на Vercel)
- [ ] Кастомный домен подключен (опционально)
- [ ] Тестовый заказ пройден успешно
