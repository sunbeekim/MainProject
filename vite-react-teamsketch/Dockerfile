# Node 빌드 스테이지
FROM node:20-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Nginx 서비스 스테이지
FROM nginx:alpine

# Nginx 설정 복사
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# 빌드된 파일들을 Nginx로 복사
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 