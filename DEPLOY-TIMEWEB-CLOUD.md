# Деплой на Timeweb Cloud

## Подготовка проекта

### 1. Структура проекта

Проект уже подготовлен для Docker-деплоя:
- ✅ `Dockerfile` - для сборки Docker-образа
- ✅ `.dockerignore` - исключения для Docker
- ✅ `vercel.json` - конфигурация в корне

### 2. Локальная проверка Docker

Перед деплоем проверьте локально:

```bash
# Сборка Docker-образа
docker build -t wood-metal-shop .

# Запуск контейнера
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e AUTH_SECRET="your-secret" \
  -e STRIPE_SECRET_KEY="sk_test_..." \
  -e RESEND_API_KEY="re_..." \
  wood-metal-shop

# Проверка
curl http://localhost:3000
```

---

## Деплой на Timeweb Cloud

### Способ 1: Через GitHub (рекомендуется)

#### Шаг 1: Подготовка репозитория

Убедитесь, что код на GitHub:
```bash
git add .
git commit -m "Add Docker support"
git push
```

#### Шаг 2: Создание проекта в Timeweb Cloud

1. Зайдите на [timeweb.cloud](https://timeweb.cloud)
2. Нажмите **"Создать проект"**
3. Выберите **"Импорт из GitHub"**
4. Авторизуйтесь через GitHub
5. Выберите репозиторий `GitSid2k/Store`

#### Шаг 3: Настройка проекта

**Основные настройки:**
- **Имя проекта**: `wood-metal-shop`
- **Тип приложения**: Docker
- **Ветка**: `master`

**Настройки Docker:**
- **Dockerfile путь**: `./Dockerfile`
- **Порт**: `3000`
- **Команда запуска**: (оставьте пустым, используется CMD из Dockerfile)

#### Шаг 4: Переменные окружения

Добавьте в Timeweb Cloud:

```bash
# Database (внешняя PostgreSQL)
DATABASE_URL=postgresql://user:password@host:5432/database

# Authentication
AUTH_SECRET=your-super-secret-key-min-32-chars

# Stripe
STRIPE_SECRET_KEY=sk_live_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_key

# Email
RESEND_API_KEY=re_your_key

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=phc_your_key

# Environment
NODE_ENV=production
```

#### Шаг 5: Запуск деплоя

1. Нажмите **"Запустить деплой"**
2. Дождитесь завершения сборки (5-10 минут)
3. Получите URL вашего приложения

---

### Способ 2: Через Docker Hub

#### Шаг 1: Сборка и загрузка в Docker Hub

```bash
# Логин в Docker Hub
docker login

# Сборка образа
docker build -t your-username/wood-metal-shop:latest .

# Загрузка в Docker Hub
docker push your-username/wood-metal-shop:latest
```

#### Шаг 2: Создание проекта в Timeweb Cloud

1. Нажмите **"Создать проект"**
2. Выберите **"Docker-образ"**
3. Укажите: `your-username/wood-metal-shop:latest`
4. Настройте переменные окружения
5. Запустите деплой

---

## База данных PostgreSQL

### Вариант 1: Managed PostgreSQL от Timeweb

1. В Timeweb Cloud создайте **"Базу данных"**
2. Выберите **PostgreSQL**
3. Настройки:
   - Версия: 14+
   - Размер: 1-5 GB (зависит от нагрузки)
4. После создания получите:
   - Host
   - Port
   - Database
   - User
   - Password

5. Добавьте в переменные окружения:
```bash
DATABASE_URL=postgresql://user:password@host:5432/database
```

### Вариант 2: Внешний PostgreSQL

Можно использовать:
- **Supabase** (бесплатно до 500 MB)
- **Neon** (бесплатно до 3 GB)
- **Railway** (платно)
- **PlanetScale** (MySQL)

**Пример для Supabase:**
1. Создайте проект на supabase.com
2. Settings → Database → Connection string
3. Скопируйте URL в `DATABASE_URL`

---

## Настройка домена

### Шаг 1: Добавление домена в Timeweb Cloud

1. Откройте проект
2. **Настройки** → **Домены**
3. Нажмите **"Добавить домен"**
4. Введите ваш домен (например, `woodmetal.ru`)

### Шаг 2: Настройка DNS

В панели регистратора домена добавьте записи:

**Для поддомена:**
```
CNAME  www  your-project.timeweb.cloud
A      @    IP_адрес_из_Timeweb
```

**Для основного домена:**
```
A      @    IP_адрес_из_Timeweb
A      www  IP_адрес_из_Timeweb
```

### Шаг 3: SSL сертификат

Timeweb Cloud автоматически выдаст бесплатный SSL сертификат.

---

## Stripe Webhook для Production

### Шаг 1: Создание webhook

1. Откройте [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Нажмите **"Add endpoint"**
3. URL: `https://yourdomain.com/api/webhooks/stripe`
4. События:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
5. Скопируйте **Signing secret**

### Шаг 2: Обновление переменных

В Timeweb Cloud обновите:
```bash
STRIPE_WEBHOOK_SECRET=whsec_your_signing_secret
```

---

## Мониторинг и логи

### Просмотр логов

1. Откройте проект в Timeweb Cloud
2. **"Логи"** → выберите контейнер
3. Логи обновляются в реальном времени

### Метрики

Timeweb Cloud показывает:
- CPU использование
- RAM использование
- Сетевой трафик
- Количество запросов

---

## Обновление проекта

### Через GitHub

```bash
# Локально
git add .
git commit -m "Update"
git push

# Timeweb Cloud автоматически пересоберет проект
```

### Вручную

1. Откройте проект в Timeweb Cloud
2. Нажмите **"Пересобрать"**
3. Дождитесь завершения

---

## Масштабирование

### Увеличение ресурсов

1. **Настройки** → **Ресурсы**
2. Выберите план:
   - **Starter**: 0.5 CPU, 512 MB RAM (~200₽/мес)
   - **Basic**: 1 CPU, 1 GB RAM (~400₽/мес)
   - **Standard**: 2 CPU, 2 GB RAM (~800₽/мес)
   - **Pro**: 4 CPU, 4 GB RAM (~1600₽/мес)

### Автоскейлинг

Настройте автоматическое масштабирование:
1. **Настройки** → **Автоскейлинг**
2. Укажите условия:
   - Min контейнеров: 1
   - Max контейнеров: 3
   - CPU порог: 70%

---

## Troubleshooting

### Ошибка: "Cannot connect to database"

**Решение:**
```bash
# Проверьте DATABASE_URL
# Убедитесь, что база доступна извне
# Проверьте firewall правила
```

### Ошибка: "Build failed"

**Решение:**
```bash
# Проверьте Dockerfile локально
docker build -t test .

# Проверьте логи сборки в Timeweb Cloud
```

### Ошибка: "Out of memory"

**Решение:**
- Увеличьте RAM в настройках проекта
- Оптимизируйте потребление памяти в коде

### Медленная работа

**Решение:**
- Увеличьте CPU
- Включите CDN для статики
- Оптимизируйте запросы к БД

---

## Стоимость

### Минимальная конфигурация

| Ресурс | Цена/мес |
|--------|----------|
| Контейнер (0.5 CPU, 512 MB) | ~200₽ |
| PostgreSQL (1 GB) | ~200₽ |
| Домен .ru | ~200₽/год |
| **Итого** | **~400-500₽/мес** |

### Рекомендуемая конфигурация

| Ресурс | Цена/мес |
|--------|----------|
| Контейнер (1 CPU, 1 GB) | ~400₽ |
| PostgreSQL (2 GB) | ~400₽ |
| Домен .ru | ~200₽/год |
| **Итого** | **~800₽/мес** |

---

## Полезные команды

### Локальная разработка

```bash
# Запуск в dev режиме
pnpm dev

# Сборка
pnpm build

# Docker сборка
docker build -t wood-metal-shop .
```

### Проверка переменных

```bash
# В контейнере
docker exec -it container_id sh
env | grep DATABASE_URL
```

---

## Чек-лист перед деплоем

- [ ] Код загружен на GitHub
- [ ] Dockerfile создан и протестирован
- [ ] Переменные окружения подготовлены
- [ ] База данных создана
- [ ] Stripe ключи получены (live mode)
- [ ] Resend API ключ получен
- [ ] Домен зарегистрирован
- [ ] DNS настроен
- [ ] SSL сертификат получен

---

## Поддержка

При проблемах:
1. Проверьте логи в Timeweb Cloud
2. Проверьте переменные окружения
3. Проверьте статус базы данных
4. Обратитесь в поддержку Timeweb

Документация Timeweb Cloud: https://timeweb.cloud/docs
