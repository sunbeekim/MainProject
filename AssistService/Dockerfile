FROM eclipse-temurin:17-jdk-alpine

# 필요한 패키지 설치
RUN apk add --no-cache curl

WORKDIR /app
COPY build/libs/*.jar app.jar

EXPOSE 8082

ENTRYPOINT ["java", "-jar", "/app/app.jar"] 