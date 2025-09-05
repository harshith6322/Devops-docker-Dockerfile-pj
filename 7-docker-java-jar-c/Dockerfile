# ===== Build Stage =====
FROM maven:3.8.7-openjdk-18-slim AS builder
LABEL author="harshith" version="1.0.0"

WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build
COPY src ./src
RUN mvn clean package -DskipTests

# ===== Runtime Stage =====
FROM eclipse-temurin:11-jre AS prod
WORKDIR /app

# Copy fat JAR from builder
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
