FROM maven:3.9.11-sapmachine-24 AS builder
LABEL author="harshith" version="1.0.0"
WORKDIR /app
COPY . .
RUN mvn clean install -DskipTests


FROM tomcat:8.0-alpine
# tomcat:8.0 better image with less cve
COPY --from=builder /app/tomcat-users.xml /usr/local/tomcat/conf
COPY --from=builder /app/target/*.war /usr/local/tomcat/webapps/myweb.war
EXPOSE 8080



# # ---- Build stage ----
# FROM maven:3.9.9-eclipse-temurin-17 AS builder
# WORKDIR /app
# COPY pom.xml .
# RUN mvn dependency:go-offline -B
# COPY src ./src
# RUN mvn clean package -DskipTests

# # ---- Runtime stage ----
# FROM tomcat:9.0-jdk17-temurin
# WORKDIR /usr/local/tomcat

# # Remove default ROOT app
# RUN rm -rf webapps/*

# # Copy WAR
# COPY --from=builder /app/target/*.war webapps/ROOT.war

# # Expose port
# EXPOSE 8080

# # Default entrypoint = Tomcat startup script
