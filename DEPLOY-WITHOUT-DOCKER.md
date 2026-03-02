# Деплой без Docker

## Вариант 1: Timeweb VPS (рекомендуется)

Самый надежный способ - использовать VPS/VDS сервер.

### Быстрая установка

```bash
# 1. Подключитесь к серверу по SSH
ssh root@YOUR_SERVER_IP

# 2. Запустите автоматическую установку
curl -o deploy.sh https://raw.githubusercontent.com/GitSid2k/Store/master/deploy-timeweb.sh
chmod +x deploy.sh
sudo bash deploy.sh
```

### Ручная установка (пошаговая)

#### Шаг 1: Установка Node.js

```bash
# Обновление системы
apt update && apt upgrade -y

# Установка Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Установка pnpm
npm install -g pnpm

# Проверка
node --version  # v18.x
pnpm --version
```

#### Шаг 2: Установка PostgreSQL

```bash
# Установка
apt install -y postgresql postgresql-contrib

# Запуск
systemctl start postgresql
systemctl enable postgresql

# Создание базы данных
sudo -u postgres psql

# В консоли PostgreSQL:
CREATE USER woodmetal WITH PASSWORD 'woodmetal2024';
CREATE DATABASE woodmetal_db OWNER woodmetal;
GRANT ALL PRIVILEGES ON DATABASE woodmetal_db TO woodmetal;
\q
```

#### Шаг 3: Установка PM2 и Nginx

```bash
# PM2 для автозапуска
npm install -g pm2

# Nginx для проксирования
apt install -y nginx
```

#### Шаг 4: Клонирование проекта

```bash
mkdir -p /var/www/wood-metal
cd /var/www/wood-metal
git clone https://github.com/GitSid2k/Store.git .
```

#### Шаг 5: Установка зависимостей

```bash
pnpm install
```

#### Шаг 6: Настройка переменных окружения

```bash
nano apps/web/.env.local
```

Вставьте:
```bash
DATABASE_URL="postgresql://woodmetal:woodmetal2024@localhost:5432/woodmetal_db"
AUTH_SECRET="$(openssl rand -base64 32)"
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
RESEND_API_KEY="re_..."
NEXT_PUBLIC_POSTHOG_KEY="phc_..."
NODE_ENV="production"
```

#### Шаг 7: Генерация Prisma и миграции

```bash
cd packages/db
pnpm prisma generate
pnpm prisma db push
cd ../..
```

#### Шаг 8: Сборка проекта

```bash
pnpm build --filter=web
```

#### Шаг 9: Настройка Nginx

```bash
nano /etc/nginx/sites-available/wood-metal
```

Вставьте:
```nginx
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Активация
ln -s /etc/nginx/sites-available/wood-metal /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
```

#### Шаг 10: Запуск через PM2

```bash
cd apps/web
pm2 start "pnpm start" --name wood-metal
pm2 startup
pm2 save
```

#### Шаг 11: SSL сертификат

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com
```

---

## Вариант 2: Vercel (самый простой)

Vercel - платформа от создателей Next.js, идеально подходит для Next.js проектов.

### Деплой на Vercel

#### Шаг 1: Подготовка

Убедитесь, что код на GitHub:
```bash
git add .
git commit -m "Prepare for Vercel"
git push
```

#### Шаг 2: Создание проекта

1. Зайдите на [vercel.com](https://vercel.com)
2. Нажмите **"Add New Project"**
3. Импортируйте репозиторий `GitSid2k/Store`

#### Шаг 3: Настройка

- **Framework Preset**: Next.js (автоопределение)
- **Root Directory**: `apps/web`
- **Build Command**: `pnpm build` (автоопределение)
- **Output Directory**: `.next` (автоопределение)

#### Шаг 4: Переменные окружения

Добавьте в Vercel Dashboard:
```bash
DATABASE_URL=postgresql://...
AUTH_SECRET=your-secret-min-32-chars
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
NEXT_PUBLIC_POSTHOG_KEY=phc_...
```

#### Шаг 5: Деплой

Нажмите **"Deploy"** и дождитесь завершения (2-5 минут).

**Плюсы Vercel:**
- ✅ Бесплатно для хобби-проектов
- ✅ Автоматический SSL
- ✅ Автоматический деплой из GitHub
- ✅ Отличная интеграция с Next.js
- ✅ Edge Functions
- ✅ Analytics

**Минусы Vercel:**
- ❌ Нет PostgreSQL (нужна внешняя база)
- ❌ Ограничения на бесплатном плане

---

## Вариант 3: Railway

Railway - простая PaaS платформа с поддержкой PostgreSQL.

### Деплой на Railway

#### Шаг 1: Создание проекта

1. Зайдите на [railway.app](https://railway.app)
2. Нажмите **"Start a New Project"**
3. Выберите **"Deploy from GitHub repo"**
4. Выберите `GitSid2k/Store`

#### Шаг 2: Добавление PostgreSQL

1. В проекте нажмите **"Add Service"**
2. Выберите **"Database"** → **"PostgreSQL"**
3. Railway автоматически создаст `DATABASE_URL`

#### Шаг 3: Настройка переменных

В Settings → Variables добавьте:
```bash
AUTH_SECRET=your-secret-min-32-chars
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
NEXT_PUBLIC_POSTHOG_KEY=phc_...
```

#### Шаг 4: Настройка сборки

Railway автоматически определит Next.js, но можно указать:
```bash
# Build Command
pnpm build --filter=web

# Start Command
cd apps/web && pnpm start
```

**Плюсы Railway:**
- ✅ Простота использования
- ✅ Встроенная PostgreSQL
- ✅ Автоматический деплой
- ✅ $5 бесплатно каждый месяц

**Минусы Railway:**
- ❌ Платно при превышении лимитов

---

## Вариант 4: Render

Render - альтернатива Railway с хорошим бесплатным планом.

### Деплой на Render

#### Шаг 1: Создание Web Service

1. Зайдите на [render.com](https://render.com)
2. Нажмите **"New"** → **"Web Service"**
3. Подключите GitHub репозиторий `GitSid2k/Store`

#### Шаг 2: Настройка

- **Name**: wood-metal-shop
- **Region**: Frankfurt (ближайший к РФ)
- **Branch**: master
- **Root Directory**: `apps/web`
- **Runtime**: Node
- **Build Command**: `cd ../.. && pnpm install && pnpm build --filter=web`
- **Start Command**: `pnpm start`

#### Шаг 3: Добавление PostgreSQL

1. Нажмите **"New"** → **"PostgreSQL"**
2. Создайте базу данных
3. Скопируйте `Internal Database URL` в переменные

#### Шаг 4: Переменные окружения

```bash
DATABASE_URL=<from Render PostgreSQL>
AUTH_SECRET=your-secret-min-32-chars
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
NEXT_PUBLIC_POSTHOG_KEY=phc_...
```

**Плюсы Render:**
- ✅ Бесплатный план для Web Services
- ✅ Бесплатная PostgreSQL (ограничена)
- ✅ Автоматический SSL
- ✅ Автоматический деплой

**Минусы Render:**
- ❌ Холодный старт на бесплатном плане
- ❌ Ограниченные ресурсы бесплатно

---

## Вариант 5: Shared Hosting (не рекомендуется)

Некоторые shared-хостинги поддерживают Node.js, но это не рекомендуется для Next.js.

**Проблемы:**
- ❌ Нет поддержки serverless functions
- ❌ Ограниченные ресурсы
- ❌ Сложная настройка
- ❌ Нет auto-scaling

---

## Сравнение вариантов

| Платформа | Цена | Сложность | PostgreSQL | Рекомендация |
|-----------|------|-----------|------------|--------------|
| **Vercel** | Бесплатно/Платно | ⭐ | Внешняя | ✅ Лучший выбор |
| **Railway** | $5/мес бесплатно | ⭐⭐ | Встроенная | ✅ Простой |
| **Render** | Бесплатно/Платно | ⭐⭐ | Встроенная | ✅ Хороший |
| **Timeweb VPS** | ~500₽/мес | ⭐⭐⭐ | Встроенная | ✅ Для РФ |
| **Shared** | ~200₽/мес | ⭐⭐⭐⭐ | Нет | ❌ Не подходит |

---

## Рекомендации

### Для быстрого старта: **Vercel**
- Самый простой вариант
- Бесплатно для разработки
- Идеально для Next.js

### Для РФ с полным контролем: **Timeweb VPS**
- Полный контроль над сервером
- PostgreSQL на том же сервере
- Не зависит от санкций

### Для простоты с базой данных: **Railway**
- Простая настройка
- Встроенная PostgreSQL
- Автоматический деплой

---

## База данных для Vercel/Railway/Render

### Supabase (бесплатно)

1. Зайдите на [supabase.com](https://supabase.com)
2. Создайте проект
3. Settings → Database → Connection string
4. Скопируйте URL:
```bash
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

### Neon (бесплатно)

1. Зайдите на [neon.tech](https://neon.tech)
2. Создайте проект
3. Скопируйте connection string

---

## Итоговая рекомендация

**Для новичков:** Vercel + Supabase
- Самый простой вариант
- Бесплатно для старта
- Минимум настроек

**Для production в РФ:** Timeweb VPS
- Полный контроль
- Нет ограничений
- Поддержка из РФ
