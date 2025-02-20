FROM nginx:alpine

# 환경 변수 설정 (기본값: local)
ARG ENV=local

# 환경에 따른 설정 파일 복사
COPY nginx.${ENV}.conf /etc/nginx/nginx.conf

# SSL 인증서 디렉토리 생성
RUN mkdir -p /etc/letsencrypt

EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]