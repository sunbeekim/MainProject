FROM openjdk:17-jdk-slim

# 필요한 패키지 설치 (Redis 포함)
RUN apt update && apt install -y curl redis-server

WORKDIR /app

COPY build/libs/*.jar app.jar
COPY src/main/resources/application.properties application.properties

# Redis 설정 디렉토리 생성
RUN mkdir -p /etc/redis
RUN mkdir -p /data/redis

# 기본 Redis 설정 생성
RUN echo "bind 127.0.0.1\nport 6379\ndaemonize yes\nsupervised auto\ndir /data/redis\nappendonly yes" > /etc/redis/redis.conf

ENV SPRING_PROFILES_ACTIVE=prod
ENV SPRING_REDIS_HOST=localhost
ENV SPRING_REDIS_PORT=6379

# Redis 데이터 디렉토리를 볼륨으로 설정
VOLUME ["/data/redis"]

EXPOSE 8081
EXPOSE 6379

# 시작 스크립트 생성
RUN echo '#!/bin/bash\n\
service redis-server start\n\
# Redis가 준비될 때까지 대기\n\
echo "Redis 서버 시작 중..."\n\
until redis-cli ping | grep -q "PONG"; do\n\
  echo "Redis 서버 준비 대기 중..."\n\
  sleep 1\n\
done\n\
echo "Redis 서버 준비 완료!"\n\
\n\
# Spring Boot 애플리케이션 실행\n\
java -jar /app/app.jar\n\
' > /app/start.sh

RUN chmod +x /app/start.sh

# 시작 스크립트 실행
CMD ["/app/start.sh"] 