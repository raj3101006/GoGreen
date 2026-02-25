# Build stage
FROM maven:3.8.5-openjdk-17 AS build
COPY . .
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jdk
# Humne pom.xml mein naam 'app' rakha hai, toh wahi uthayenge
COPY --from=build /target/app.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app.jar"]
