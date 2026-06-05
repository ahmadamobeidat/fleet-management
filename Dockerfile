# استخدام Node.js 18 كصورة أساسية
FROM node:18-alpine

# تحديد مجلد العمل داخل الحاوية
WORKDIR /app

# نسخ ملفات package أولاً للاستفادة من Docker cache
COPY package*.json ./

# تثبيت الحزم
RUN npm install

# نسخ باقي ملفات المشروع
COPY . .

# بناء التطبيق
RUN npm run build

# فتح البورت 3000
EXPOSE 3000

# تشغيل التطبيق
CMD ["npm", "start"]