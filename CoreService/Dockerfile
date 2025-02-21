FROM openjdk:17-jdk-slim

# 필요한 패키지 설치
RUN apt update && apt install -y curl

WORKDIR /app
COPY build/libs/*.jar app.jar

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "/app/app.jar"] 