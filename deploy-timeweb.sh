#!/bin/bash
# Автоматическая установка Wood & Metal Shop на Timeweb VPS
# Запуск: sudo bash deploy-timeweb.sh

set -e

echo "=== Wood & Metal Shop - Автоматическая установка ==="

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 1. Обновление системы
echo -e "${YELLOW}Обновление системы...${NC}"
apt update && apt upgrade -y

# 2. Установка Node.js 18
echo -e "${YELLOW}Установка Node.js 18...${NC}"
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# 3. Установка pnpm
echo -e "${YELLOW}Установка pnpm...${NC}"
npm install -g pnpm

# 4. Установка PostgreSQL
echo -e "${YELLOW}Установка PostgreSQL...${NC}"
apt install -y postgresql postgresql-contrib

# 5. Создание базы данных
echo -e "${YELLOW}Настройка базы данных...${NC}"
sudo -u postgres psql <<EOF
CREATE USER woodmetal WITH PASSWORD 'woodmetal2024';
CREATE DATABASE woodmetal_db OWNER woodmetal;
GRANT ALL PRIVILEGES ON DATABASE woodmetal_db TO woodmetal;
EOF

# 6. Установка PM2
echo -e "${YELLOW}Установка PM2...${NC}"
npm install -g pm2

# 7. Установка Nginx
echo -e "${YELLOW}Установка Nginx...${NC}"
apt install -y nginx

# 8. Установка Git
echo -e "${YELLOW}Установка Git...${NC}"
apt install -y git

# 9. Создание директории проекта
echo -e "${YELLOW}Создание директории проекта...${NC}"
mkdir -p /var/www/wood-metal
cd /var/www/wood-metal

# 10. Клонирование проекта
echo -e "${YELLOW}Клонирование проекта...${NC}"
git clone https://github.com/GitSid2k/Store.git .

# 11. Установка зависимостей
echo -e "${YELLOW}Установка зависимостей...${NC}"
pnpm install

# 12. Генерация Prisma Client
echo -e "${YELLOW}Генерация Prisma Client...${NC}"
cd packages/db
pnpm prisma generate
cd ../..

# 13. Создание .env.local
echo -e "${YELLOW}Создание .env.local...${NC}"
cat > apps/web/.env.local <<EOF
DATABASE_URL="postgresql://woodmetal:woodmetal2024@localhost:5432/woodmetal_db"
AUTH_SECRET="$(openssl rand -base64 32)"
STRIPE_SECRET_KEY="sk_live_YOUR_KEY"
STRIPE_WEBHOOK_SECRET="whsec_YOUR_KEY"
RESEND_API_KEY="re_YOUR_KEY"
NEXT_PUBLIC_POSTHOG_KEY="phc_YOUR_KEY"
NODE_ENV="production"
EOF

# 14. Применение миграций
echo -e "${YELLOW}Применение миграций базы данных...${NC}"
cd packages/db
pnpm prisma db push
cd ../..

# 15. Сборка проекта
echo -e "${YELLOW}Сборка проекта...${NC}"
pnpm build --filter=web

# 16. Настройка Nginx
echo -e "${YELLOW}Настройка Nginx...${NC}"
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

    location /api/webhooks/stripe {
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

# Активация сайта
ln -sf /etc/nginx/sites-available/wood-metal /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Проверка Nginx
nginx -t

# 17. Запуск через PM2
echo -e "${YELLOW}Запуск приложения через PM2...${NC}"
cd apps/web
pm2 start "pnpm start" --name wood-metal
pm2 startup
pm2 save

# 18. Перезапуск Nginx
echo -e "${YELLOW}Перезапуск Nginx...${NC}"
systemctl restart nginx

# 19. Установка Certbot для SSL
echo -e "${YELLOW}Установка Certbot...${NC}"
apt install -y certbot python3-certbot-nginx

# Финальное сообщение
echo -e "${GREEN}=== Установка завершена! ===${NC}"
echo ""
echo "Ваш сайт доступен по IP адресу сервера"
echo ""
echo "Следующие шаги:"
echo "1. Отредактируйте apps/web/.env.local с вашими ключами:"
echo "   nano /var/www/wood-metal/apps/web/.env.local"
echo ""
echo "2. Перезапустите приложение:"
echo "   pm2 restart wood-metal"
echo ""
echo "3. Для SSL сертификата (замените domain.com на ваш домен):"
echo "   certbot --nginx -d domain.com"
echo ""
echo "4. Полезные команды:"
echo "   - Логи: pm2 logs wood-metal"
echo "   - Статус: pm2 status"
echo "   - Перезапуск: pm2 restart wood-metal"
echo ""
echo "База данных PostgreSQL:"
echo "  Host: localhost"
echo "  Port: 5432"
echo "  Database: woodmetal_db"
echo "  User: woodmetal"
echo "  Password: woodmetal2024"
