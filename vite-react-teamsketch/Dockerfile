# Node 빌드 스테이지
FROM node:20-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Nginx 서비스 스테이지
FROM nginx:alpine

# 환경 변수 설정 (기본값: local)
ARG ENV=local

# nginx 설정 파일 복사 (환경별 설정)
COPY nginx/nginx.${ENV}.conf /etc/nginx/nginx.conf

# 빌드된 파일들을 Nginx로 복사
COPY --from=build /app/dist /usr/share/nginx/html

# SSL 인증서 디렉토리 생성
RUN mkdir -p /etc/letsencrypt

EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"] 

