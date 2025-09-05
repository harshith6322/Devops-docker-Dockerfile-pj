FROM eclipse-temurin:11-jdk
WORKDIR /app

# Copy correct file (capital H)
COPY Hello.java .

# Compile inside container
# RUN javac Hello.java

# Run program
# produces Hello.class
RUN javac Hello.java && jar cvfe hello.jar Hello Hello.class
# ENTRYPOINT ["java", "Hello"]
ENTRYPOINT ["java", "-jar", "hello.jar"]

