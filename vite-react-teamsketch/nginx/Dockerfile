FROM nginx:alpine

# 환경 변수 설정
ARG ENV=local

# 환경에 따른 설정 파일 복사
COPY nginx.${ENV}.conf /etc/nginx/nginx.conf

EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]