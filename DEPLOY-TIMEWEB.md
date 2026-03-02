# Деплой на Timeweb VPS

## Быстрая установка (автоматическая)

### 1. Заказ VPS

1. Зайдите на [timeweb.com](https://timeweb.com)
2. Выберите **VPS/VDS**
3. Конфигурация:
   - **ОС**: Ubuntu 22.04 LTS
   - **CPU**: 2 ядра
   - **RAM**: 4 GB
   - **SSD**: 40 GB
   - **Цена**: ~500-700₽/мес
4. Оплатите и получите IP адрес

### 2. Подключение по SSH

```bash
ssh root@YOUR_SERVER_IP
```

### 3. Запуск автоматической установки

```bash
# Скачайте скрипт
curl -o deploy.sh https://raw.githubusercontent.com/GitSid2k/Store/master/deploy-timeweb.sh

# Сделайте исполняемым
chmod +x deploy.sh

# Запустите
sudo bash deploy.sh
```

Скрипт автоматически:
- ✅ Установит Node.js 18
- ✅ Установит pnpm
- ✅ Установит PostgreSQL
- ✅ Создаст базу данных
- ✅ Склонирует проект
- ✅ Установит зависимости
- ✅ Соберет проект
- ✅ Настроит Nginx
- ✅ Запустит через PM2

### 4. Настройка переменных окружения

```bash
# Отредактируйте .env.local
nano /var/www/wood-metal/apps/web/.env.local
```

Замените заглушки на реальные ключи:
```bash
DATABASE_URL="postgresql://woodmetal:woodmetal2024@localhost:5432/woodmetal_db"
AUTH_SECRET="ваш-секретный-ключ-минимум-32-символа"
STRIPE_SECRET_KEY="sk_live_ваш_ключ"
STRIPE_WEBHOOK_SECRET="whsec_ваш_ключ"
RESEND_API_KEY="re_ваш_ключ"
NEXT_PUBLIC_POSTHOG_KEY="phc_ваш_ключ"
NODE_ENV="production"
```

```bash
# Сохраните и перезапустите
pm2 restart wood-metal
```

### 5. SSL сертификат (бесплатный)

```bash
# Установите Certbot
apt install -y certbot python3-certbot-nginx

# Получите сертификат (замените domain.com на ваш домен)
certbot --nginx -d domain.com -d www.domain.com

# Автоматическое обновление
certbot renew --dry-run
```

---

## Ручная установка (пошаговая)

### 1. Обновление системы

```bash
apt update && apt upgrade -y
```

### 2. Установка Node.js 18

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs
node --version  # Должно показать v18.x
```

### 3. Установка pnpm

```bash
npm install -g pnpm
pnpm --version
```

### 4. Установка PostgreSQL

```bash
apt install -y postgresql postgresql-contrib

# Запуск
systemctl start postgresql
systemctl enable postgresql

# Создание базы
sudo -u postgres psql
CREATE USER woodmetal WITH PASSWORD 'woodmetal2024';
CREATE DATABASE woodmetal_db OWNER woodmetal;
GRANT ALL PRIVILEGES ON DATABASE woodmetal_db TO woodmetal;
\q
```

### 5. Установка PM2

```bash
npm install -g pm2
```

### 6. Установка Nginx

```bash
apt install -y nginx
systemctl start nginx
systemctl enable nginx
```

### 7. Клонирование проекта

```bash
mkdir -p /var/www/wood-metal
cd /var/www/wood-metal
git clone https://github.com/GitSid2k/Store.git .
```

### 8. Установка зависимостей

```bash
pnpm install
```

### 9. Генерация Prisma Client

```bash
cd packages/db
pnpm prisma generate
cd ../..
```

### 10. Создание .env.local

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

### 11. Применение миграций

```bash
cd packages/db
pnpm prisma db push
cd ../..
```

### 12. Сборка проекта

```bash
pnpm build --filter=web
```

### 13. Настройка Nginx

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

### 14. Запуск через PM2

```bash
cd apps/web
pm2 start "pnpm start" --name wood-metal
pm2 startup
pm2 save
```

---

## Полезные команды

### PM2 (управление приложением)

```bash
pm2 status              # Статус
pm2 logs wood-metal     # Логи
pm2 restart wood-metal  # Перезапуск
pm2 stop wood-metal     # Остановка
pm2 start wood-metal    # Запуск
pm2 delete wood-metal   # Удаление
```

### Nginx

```bash
systemctl status nginx  # Статус
systemctl restart nginx # Перезапуск
nginx -t               # Проверка конфигурации
```

### PostgreSQL

```bash
systemctl status postgresql  # Статус
sudo -u postgres psql        # Консоль БД
```

### Обновление проекта

```bash
cd /var/www/wood-metal
git pull
pnpm install
pnpm build --filter=web
pm2 restart wood-metal
```

---

## Брандмауэр (UFW)

```bash
# Установка
apt install -y ufw

# Разрешить подключения
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS

# Включить
ufw enable

# Статус
ufw status
```

---

## Мониторинг

### Установка htop

```bash
apt install -y htop
htop
```

### Логи Nginx

```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Логи приложения

```bash
pm2 logs wood-metal
```

---

## Резервное копирование

### База данных

```bash
# Бэкап
pg_dump -U woodmetal woodmetal_db > backup_$(date +%Y%m%d).sql

# Восстановление
psql -U woodmetal woodmetal_db < backup_20260302.sql
```

### Автоматический бэкап (cron)

```bash
crontab -e
# Добавьте строку для ежедневного бэкапа в 2:00
0 2 * * * pg_dump -U woodmetal woodmetal_db > /var/backups/woodmetal_$(date +\%Y\%m\%d).sql
```

---

## Стоимость

| Ресурс | Цена/мес |
|--------|----------|
| VPS 2vCPU/4GB | ~500-700₽ |
| Домен .ru | ~200-400₽ |
| **Итого** | **~700-1100₽/мес** |

---

## Поддержка

При проблемах проверьте:
1. Логи PM2: `pm2 logs wood-metal`
2. Логи Nginx: `tail -f /var/log/nginx/error.log`
3. Статус сервисов: `systemctl status nginx postgresql`
4. Порты: `netstat -tulpn | grep LISTEN`
