FROM openjdk:17-jdk-slim

# 필요한 패키지 설치
RUN apk add --no-cache curl

WORKDIR /app
COPY target/*.jar app.jar
COPY src/main/resources/application.properties application.properties

ENV SPRING_PROFILES_ACTIVE=prod

EXPOSE 8082

ENTRYPOINT ["java", "-jar", "app.jar"] 