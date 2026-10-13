# ===================================================================
# Stage 1: Build the Spring Boot application using Maven
# ===================================================================
FROM eclipse-temurin:21-jdk-jammy AS builder

WORKDIR /build

# Copy Maven Wrapper and POM first to leverage Docker layer caching
COPY mvnw mvnw.cmd pom.xml ./

# Pre-fetch dependencies
RUN ./mvnw dependency:go-offline -B || true

# Copy source code and build production jar
COPY src src
RUN ./mvnw clean package -DskipTests -B

# ===================================================================
# Stage 2: Minimal Production JRE Runtime
# ===================================================================
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Add a non-root system user for security
RUN groupadd -r campus && useradd -r -g campus campus

# Create uploads directory with appropriate permissions
RUN mkdir -p /app/uploads && chown -R campus:campus /app

# Copy the built executable jar from builder stage
COPY --from=builder --chown=campus:campus /build/target/*.jar /app/smart-campus-backend.jar

USER campus

# Expose HTTP port (Render dynamically provides PORT env variable, defaulting to 8080)
ENV PORT=8080
EXPOSE 8080

# Configure JVM options for container environments
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/./urandom"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/smart-campus-backend.jar --server.port=${PORT:-8080} --server.address=0.0.0.0"]
