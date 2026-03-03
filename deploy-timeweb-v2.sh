#!/bin/bash
# Wood & Metal Shop - Установка на Timeweb VPS
# Запуск: sudo bash deploy-timeweb-v2.sh

set -e

echo "=== Wood & Metal Shop - Автоматическая установка ==="

# 1. Обновление системы
echo "Обновление системы..."
apt update && apt upgrade -y

# 2. Установка Node.js 18
echo "Установка Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# 3. Установка pnpm
echo "Установка pnpm..."
npm install -g pnpm

# 4. Установка PostgreSQL
echo "Установка PostgreSQL..."
apt install -y postgresql postgresql-contrib

# 5. Создание базы данных
echo "Настройка базы данных..."
sudo -u postgres psql -c "CREATE USER woodmetal WITH PASSWORD 'woodmetal2024';"
sudo -u postgres psql -c "CREATE DATABASE woodmetal_db OWNER woodmetal;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE woodmetal_db TO woodmetal;"

# 6. Установка PM2
echo "Установка PM2..."
npm install -g pm2

# 7. Установка Nginx
echo "Установка Nginx..."
apt install -y nginx

# 8. Создание директории проекта
echo "Создание директории проекта..."
mkdir -p /var/www/wood-metal
cd /var/www/wood-metal

# 9. Клонирование проекта
echo "Клонирование проекта..."
git clone https://github.com/GitSid2k/Store.git .

# 10. Установка зависимостей
echo "Установка зависимостей..."
pnpm install

# 11. Генерация Prisma Client
echo "Генерация Prisma Client..."
cd packages/db
pnpm prisma generate
cd ../..

# 12. Создание .env.local
echo "Создание .env.local..."
AUTH_SECRET=$(openssl rand -base64 32)
cat > apps/web/.env.local <<EOF
DATABASE_URL="postgresql://woodmetal:woodmetal2024@localhost:5432/woodmetal_db"
AUTH_SECRET="${AUTH_SECRET}"
STRIPE_SECRET_KEY="sk_live_REPLACE_ME"
STRIPE_WEBHOOK_SECRET="whsec_REPLACE_ME"
RESEND_API_KEY="re_REPLACE_ME"
NEXT_PUBLIC_POSTHOG_KEY="phc_REPLACE_ME"
NODE_ENV="production"
EOF

# 13. Применение миграций
echo "Применение миграций базы данных..."
cd packages/db
pnpm prisma db push
cd ../..

# 14. Сборка проекта
echo "Сборка проекта (это займет несколько минут)..."
pnpm build --filter=web

# 15. Настройка Nginx
echo "Настройка Nginx..."
cat > /etc/nginx/sites-available/wood-metal <<'EOF'
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
        proxy_read_timeout 86400;
    }
}
EOF

ln -sf /etc/nginx/sites-available/wood-metal /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t

# 16. Запуск через PM2
echo "Запуск приложения через PM2..."
cd apps/web
pm2 start "pnpm start" --name wood-metal
pm2 startup
pm2 save

# 17. Перезапуск Nginx
echo "Перезапуск Nginx..."
systemctl restart nginx

# 18. Установка Certbot
echo "Установка Certbot для SSL..."
apt install -y certbot python3-certbot-nginx

# Финальное сообщение
echo ""
echo "=========================================="
echo "✅ Установка завершена!"
echo "=========================================="
echo ""
echo "Ваш сайт доступен по IP адресу сервера"
echo ""
echo "Следующие шаги:"
echo ""
echo "1. Отредактируйте переменные окружения:"
echo "   nano /var/www/wood-metal/apps/web/.env.local"
echo ""
echo "   Замените REPLACE_ME на реальные ключи:"
echo "   - STRIPE_SECRET_KEY"
echo "   - STRIPE_WEBHOOK_SECRET"
echo "   - RESEND_API_KEY"
echo "   - NEXT_PUBLIC_POSTHOG_KEY"
echo ""
echo "2. Перезапустите приложение:"
echo "   pm2 restart wood-metal"
echo ""
echo "3. Для SSL сертификата:"
echo "   certbot --nginx -d yourdomain.com"
echo ""
echo "Полезные команды:"
echo "  pm2 logs wood-metal    - просмотр логов"
echo "  pm2 status             - статус приложения"
echo "  pm2 restart wood-metal - перезапуск"
echo ""
echo "База данных:"
echo "  Host: localhost"
echo "  Port: 5432"
echo "  Database: woodmetal_db"
echo "  User: woodmetal"
echo "  Password: woodmetal2024"
