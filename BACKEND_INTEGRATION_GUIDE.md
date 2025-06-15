# Spring Boot Backend Integration Guide

This guide provides all the necessary commands, files, and code snippets to connect the Krish Hortus React frontend to a Spring Boot backend.

## 🏗️ Backend Architecture Overview

```
React Frontend ↔ Spring Boot API Gateway ↔ Microservices ↔ PostgreSQL
                                              ↓
                                          AWS S3 (Media)
```

## 📋 Prerequisites

- Java 17 or higher
- Maven 3.6+ or Gradle 7+
- PostgreSQL 13+
- Docker (optional, for containerization)
- AWS account (for S3 storage)

## 🚀 Step 1: Create Spring Boot Project Structure

### Create the main project directory:
```bash
mkdir krish-hortus-backend
cd krish-hortus-backend
```

### Generate Spring Boot projects using Spring Initializr:
```bash
# API Gateway
curl https://start.spring.io/starter.zip \
  -d dependencies=web,gateway,eureka-discovery-client \
  -d groupId=com.krishhortus \
  -d artifactId=api-gateway \
  -d name=api-gateway \
  -d packageName=com.krishhortus.gateway \
  -o api-gateway.zip

# Auth Service
curl https://start.spring.io/starter.zip \
  -d dependencies=web,data-jpa,postgresql,security,validation \
  -d groupId=com.krishhortus \
  -d artifactId=auth-service \
  -d name=auth-service \
  -d packageName=com.krishhortus.auth \
  -o auth-service.zip

# Tree Service
curl https://start.spring.io/starter.zip \
  -d dependencies=web,data-jpa,postgresql,validation \
  -d groupId=com.krishhortus \
  -d artifactId=tree-service \
  -d name=tree-service \
  -d packageName=com.krishhortus.tree \
  -o tree-service.zip

# AI Service
curl https://start.spring.io/starter.zip \
  -d dependencies=web,validation \
  -d groupId=com.krishhortus \
  -d artifactId=ai-service \
  -d name=ai-service \
  -d packageName=com.krishhortus.ai \
  -o ai-service.zip

# Media Service
curl https://start.spring.io/starter.zip \
  -d dependencies=web,validation \
  -d groupId=com.krishhortus \
  -d artifactId=media-service \
  -d name=media-service \
  -d packageName=com.krishhortus.media \
  -o media-service.zip
```

### Extract all zip files:
```bash
unzip api-gateway.zip -d api-gateway
unzip auth-service.zip -d auth-service
unzip tree-service.zip -d tree-service
unzip ai-service.zip -d ai-service
unzip media-service.zip -d media-service
rm *.zip
```

## 🔧 Step 2: Configure API Gateway

### `api-gateway/src/main/resources/application.yml`:
```yaml
server:
  port: 8080

spring:
  application:
    name: api-gateway
  cloud:
    gateway:
      routes:
        - id: auth-service
          uri: http://localhost:8081
          predicates:
            - Path=/api/auth/**
        - id: tree-service
          uri: http://localhost:8082
          predicates:
            - Path=/api/trees/**
        - id: ai-service
          uri: http://localhost:8083
          predicates:
            - Path=/api/ai/**
        - id: media-service
          uri: http://localhost:8084
          predicates:
            - Path=/api/upload/**
      globalcors:
        corsConfigurations:
          '[/**]':
            allowedOrigins: 
              - "http://localhost:5173"
              - "https://*.lovable.app"
            allowedMethods:
              - GET
              - POST
              - PUT
              - DELETE
              - PATCH
              - OPTIONS
            allowedHeaders: "*"
            allowCredentials: true

logging:
  level:
    org.springframework.cloud.gateway: DEBUG
```

### `api-gateway/src/main/java/com/krishhortus/gateway/GatewayApplication.java`:
```java
package com.krishhortus.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

@SpringBootApplication
public class GatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        corsConfig.setAllowCredentials(true);
        corsConfig.addAllowedOriginPattern("*");
        corsConfig.addAllowedHeader("*");
        corsConfig.addAllowedMethod("*");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);

        return new CorsWebFilter(source);
    }
}
```

## 🔐 Step 3: Configure Auth Service

### Add dependencies to `auth-service/pom.xml`:
```xml
<dependencies>
    <!-- Existing dependencies -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.11.5</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>
</dependencies>
```

### `auth-service/src/main/resources/application.yml`:
```yaml
server:
  port: 8081

spring:
  application:
    name: auth-service
  datasource:
    url: jdbc:postgresql://localhost:5432/krish_auth_db
    username: ${DB_USERNAME:postgres}
    password: ${DB_PASSWORD:password}
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect

jwt:
  secret: ${JWT_SECRET:krishHortusSecretKeyForJWTTokenGeneration2024}
  expiration: 86400000 # 24 hours
  refresh-expiration: 604800000 # 7 days

logging:
  level:
    com.krishhortus.auth: DEBUG
```

### `auth-service/src/main/java/com/krishhortus/auth/entity/User.java`:
```java
package com.krishhortus.auth.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Email
    @NotBlank
    @Column(unique = true)
    private String email;

    @NotBlank
    @Size(min = 6)
    private String password;

    @NotBlank
    @Size(min = 2, max = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    private boolean isVerified = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    private boolean isActive = true;

    private String profilePicture;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Constructors, getters, and setters
    public User() {}

    public User(String email, String password, String name) {
        this.email = email;
        this.password = password;
        this.name = name;
    }

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public boolean isVerified() { return isVerified; }
    public void setVerified(boolean verified) { isVerified = verified; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getLastLogin() { return lastLogin; }
    public void setLastLogin(LocalDateTime lastLogin) { this.lastLogin = lastLogin; }

    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }

    public String getProfilePicture() { return profilePicture; }
    public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture; }

    public enum Role {
        USER, ADMIN, MODERATOR
    }
}
```

### `auth-service/src/main/java/com/krishhortus/auth/controller/AuthController.java`:
```java
package com.krishhortus.auth.controller;

import com.krishhortus.auth.dto.*;
import com.krishhortus.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "https://*.lovable.app"})
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse authResponse = authService.login(request);
            return ResponseEntity.ok(new ApiResponse<>(authResponse, "Login successful", true));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(null, e.getMessage(), false));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse authResponse = authService.register(request);
            return ResponseEntity.ok(new ApiResponse<>(authResponse, "Registration successful", true));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(null, e.getMessage(), false));
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(@RequestBody RefreshTokenRequest request) {
        try {
            AuthResponse authResponse = authService.refreshToken(request.getRefreshToken());
            return ResponseEntity.ok(new ApiResponse<>(authResponse, "Token refreshed", true));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(null, e.getMessage(), false));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout() {
        return ResponseEntity.ok(new ApiResponse<>("", "Logout successful", true));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> getProfile(@RequestHeader("Authorization") String token) {
        try {
            UserResponse user = authService.getCurrentUser(token);
            return ResponseEntity.ok(new ApiResponse<>(user, "Profile retrieved", true));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(null, e.getMessage(), false));
        }
    }
}
```

## 🌳 Step 4: Configure Tree Service

### Add H3 dependency to `tree-service/pom.xml`:
```xml
<dependencies>
    <!-- Existing dependencies -->
    <dependency>
        <groupId>com.uber</groupId>
        <artifactId>h3</artifactId>
        <version>4.1.1</version>
    </dependency>
</dependencies>
```

### `tree-service/src/main/resources/application.yml`:
```yaml
server:
  port: 8082

spring:
  application:
    name: tree-service
  datasource:
    url: jdbc:postgresql://localhost:5432/krish_tree_db
    username: ${DB_USERNAME:postgres}
    password: ${DB_PASSWORD:password}
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect

h3:
  resolution: 15

logging:
  level:
    com.krishhortus.tree: DEBUG
```

### `tree-service/src/main/java/com/krishhortus/tree/entity/Tree.java`:
```java
package com.krishhortus.tree.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "trees")
public class Tree {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @NotBlank
    private String name;

    private String scientificName;
    private String localName;

    @Enumerated(EnumType.STRING)
    @NotNull
    private TreeCategory category;

    @Embedded
    private Location location;

    @Embedded
    private Measurements measurements;

    @OneToMany(mappedBy = "tree", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TreePhoto> photos;

    @NotBlank
    private String taggedBy;

    @Column(name = "tagged_at")
    private LocalDateTime taggedAt;

    private boolean isAIGenerated = false;
    private boolean isVerified = false;
    private String verifiedBy;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (taggedAt == null) {
            taggedAt = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Constructors, getters, and setters
    public Tree() {}

    // All getters and setters...
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    // ... (include all other getters and setters)

    public enum TreeCategory {
        FARM, COMMUNITY, NURSERY, EXTENSION, NGO_COLLABORATION
    }
}
```

### `tree-service/src/main/java/com/krishhortus/tree/controller/TreeController.java`:
```java
package com.krishhortus.tree.controller;

import com.krishhortus.tree.dto.*;
import com.krishhortus.tree.service.TreeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trees")
@CrossOrigin(origins = {"http://localhost:5173", "https://*.lovable.app"})
public class TreeController {

    @Autowired
    private TreeService treeService;

    @GetMapping
    public ResponseEntity<ApiResponse<TreeResponse>> getAllTrees(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String species,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng,
            @RequestParam(required = false) Double radius,
            @RequestParam(required = false) String h3Index,
            @RequestParam(required = false) Boolean verified,
            Pageable pageable) {
        
        TreeSearchParams params = new TreeSearchParams(category, species, lat, lng, radius, h3Index, verified);
        TreeResponse response = treeService.getAllTrees(params, pageable);
        return ResponseEntity.ok(new ApiResponse<>(response, "Trees retrieved successfully", true));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TreeDto>> createTree(@Valid @RequestBody CreateTreeRequest request) {
        try {
            TreeDto tree = treeService.createTree(request);
            return ResponseEntity.ok(new ApiResponse<>(tree, "Tree created successfully", true));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(null, e.getMessage(), false));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TreeDto>> getTreeById(@PathVariable String id) {
        try {
            TreeDto tree = treeService.getTreeById(id);
            return ResponseEntity.ok(new ApiResponse<>(tree, "Tree retrieved successfully", true));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TreeDto>> updateTree(
            @PathVariable String id, 
            @Valid @RequestBody UpdateTreeRequest request) {
        try {
            TreeDto tree = treeService.updateTree(id, request);
            return ResponseEntity.ok(new ApiResponse<>(tree, "Tree updated successfully", true));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(null, e.getMessage(), false));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteTree(@PathVariable String id) {
        try {
            treeService.deleteTree(id);
            return ResponseEntity.ok(new ApiResponse<>("", "Tree deleted successfully", true));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(null, e.getMessage(), false));
        }
    }

    @GetMapping("/nearby")
    public ResponseEntity<ApiResponse<List<TreeDto>>> getNearbyTrees(
            @RequestParam Double lat,
            @RequestParam Double lng,
            @RequestParam Double radius,
            @RequestParam(defaultValue = "50") Integer limit) {
        
        List<TreeDto> trees = treeService.getNearbyTrees(lat, lng, radius, limit);
        return ResponseEntity.ok(new ApiResponse<>(trees, "Nearby trees retrieved", true));
    }

    @PostMapping("/{id}/verify")
    public ResponseEntity<ApiResponse<TreeDto>> verifyTree(@PathVariable String id) {
        try {
            TreeDto tree = treeService.verifyTree(id);
            return ResponseEntity.ok(new ApiResponse<>(tree, "Tree verified successfully", true));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(null, e.getMessage(), false));
        }
    }
}
```

## 🤖 Step 5: Configure AI Service

### Add Google AI dependency to `ai-service/pom.xml`:
```xml
<dependencies>
    <!-- Existing dependencies -->
    <dependency>
        <groupId>com.google.cloud</groupId>
        <artifactId>google-cloud-aiplatform</artifactId>
        <version>3.35.0</version>
    </dependency>
    <dependency>
        <groupId>com.google.code.gson</groupId>
        <artifactId>gson</artifactId>
        <version>2.10.1</version>
    </dependency>
</dependencies>
```

### `ai-service/src/main/resources/application.yml`:
```yaml
server:
  port: 8083

spring:
  application:
    name: ai-service

google:
  ai:
    api-key: ${GOOGLE_AI_API_KEY:your-google-ai-api-key}
    model: gemini-1.5-flash

logging:
  level:
    com.krishhortus.ai: DEBUG
```

### `ai-service/src/main/java/com/krishhortus/ai/controller/AIController.java`:
```java
package com.krishhortus.ai.controller;

import com.krishhortus.ai.dto.*;
import com.krishhortus.ai.service.TreeIdentificationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = {"http://localhost:5173", "https://*.lovable.app"})
public class AIController {

    @Autowired
    private TreeIdentificationService identificationService;

    @PostMapping("/identify")
    public ResponseEntity<ApiResponse<TreeIdentificationResult>> identifyTree(
            @RequestParam("image") MultipartFile image) {
        try {
            TreeIdentificationResult result = identificationService.identifyTree(image);
            return ResponseEntity.ok(new ApiResponse<>(result, "Tree identified successfully", true));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(null, e.getMessage(), false));
        }
    }

    @PostMapping("/analyze")
    public ResponseEntity<ApiResponse<TreeAnalysisResult>> analyzeTree(
            @Valid @RequestBody TreeAnalysisRequest request) {
        try {
            TreeAnalysisResult result = identificationService.analyzeTree(request);
            return ResponseEntity.ok(new ApiResponse<>(result, "Tree analyzed successfully", true));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(null, e.getMessage(), false));
        }
    }

    @GetMapping("/species-info/{species}")
    public ResponseEntity<ApiResponse<SpeciesInfo>> getSpeciesInfo(@PathVariable String species) {
        try {
            SpeciesInfo info = identificationService.getSpeciesInfo(species);
            return ResponseEntity.ok(new ApiResponse<>(info, "Species information retrieved", true));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(null, e.getMessage(), false));
        }
    }
}
```

## 📁 Step 6: Configure Media Service

### Add AWS dependencies to `media-service/pom.xml`:
```xml
<dependencies>
    <!-- Existing dependencies -->
    <dependency>
        <groupId>software.amazon.awssdk</groupId>
        <artifactId>s3</artifactId>
        <version>2.21.29</version>
    </dependency>
    <dependency>
        <groupId>software.amazon.awssdk</groupId>
        <artifactId>auth</artifactId>
        <version>2.21.29</version>
    </dependency>
</dependencies>
```

### `media-service/src/main/resources/application.yml`:
```yaml
server:
  port: 8084

spring:
  application:
    name: media-service
  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 50MB

aws:
  region: ${AWS_REGION:us-east-1}
  s3:
    bucket: ${S3_BUCKET:krish-hortus-media}
  credentials:
    access-key: ${AWS_ACCESS_KEY:your-access-key}
    secret-key: ${AWS_SECRET_KEY:your-secret-key}

logging:
  level:
    com.krishhortus.media: DEBUG
```

## 🗄️ Step 7: Database Setup

### Create PostgreSQL databases:
```sql
-- Connect to PostgreSQL as superuser
CREATE DATABASE krish_auth_db;
CREATE DATABASE krish_tree_db;

-- Create users and grant permissions
CREATE USER krish_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE krish_auth_db TO krish_user;
GRANT ALL PRIVILEGES ON DATABASE krish_tree_db TO krish_user;

-- Connect to each database and create extensions
\c krish_tree_db
CREATE EXTENSION IF NOT EXISTS postgis;
```

### Database schema creation scripts:
```sql
-- Trees table (will be created automatically by JPA)
-- But you can run this for manual setup:

CREATE TABLE trees (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    scientific_name VARCHAR(255),
    local_name VARCHAR(255),
    category VARCHAR(50) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    h3_index VARCHAR(15) NOT NULL,
    address TEXT,
    height DECIMAL(5, 2),
    trunk_width DECIMAL(5, 2),
    canopy_spread DECIMAL(5, 2),
    tagged_by VARCHAR(36) NOT NULL,
    tagged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_ai_generated BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by VARCHAR(36),
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_trees_h3_index ON trees(h3_index);
CREATE INDEX idx_trees_location ON trees(latitude, longitude);
CREATE INDEX idx_trees_category ON trees(category);
```

## 🚀 Step 8: Running the Services

### Start each service in separate terminals:

```bash
# Terminal 1 - API Gateway
cd api-gateway
./mvnw spring-boot:run

# Terminal 2 - Auth Service
cd auth-service
./mvnw spring-boot:run

# Terminal 3 - Tree Service
cd tree-service
./mvnw spring-boot:run

# Terminal 4 - AI Service
cd ai-service
./mvnw spring-boot:run

# Terminal 5 - Media Service
cd media-service
./mvnw spring-boot:run
```

### Or use Docker Compose:

Create `docker-compose.yml` in the root directory:
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:13
    environment:
      POSTGRES_DB: postgres
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  api-gateway:
    build: ./api-gateway
    ports:
      - "8080:8080"
    depends_on:
      - auth-service
      - tree-service

  auth-service:
    build: ./auth-service
    ports:
      - "8081:8081"
    depends_on:
      - postgres
    environment:
      DB_USERNAME: postgres
      DB_PASSWORD: password

  tree-service:
    build: ./tree-service
    ports:
      - "8082:8082"
    depends_on:
      - postgres
    environment:
      DB_USERNAME: postgres
      DB_PASSWORD: password

volumes:
  postgres_data:
```

Run with:
```bash
docker-compose up -d
```

## 🔧 Step 9: Frontend Configuration

### Update environment variables (create `.env.local` file):
```bash
VITE_API_BASE_URL=http://localhost:8080/api
VITE_WS_BASE_URL=ws://localhost:8080/ws
```

### The frontend is already configured to work with these endpoints in:
- `src/config/api.ts` - API configuration
- `src/services/apiClient.ts` - HTTP client
- `src/services/authService.ts` - Authentication service
- `src/services/treeService.ts` - Tree service

## 🧪 Step 10: Testing the Integration

### Test the API endpoints:

```bash
# Test auth service
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Test login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test tree creation (replace TOKEN with actual JWT)
curl -X POST http://localhost:8080/api/trees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"name":"Oak Tree","category":"FARM","location":{"lat":12.9716,"lng":77.5946}}'
```

## 📝 Additional DTOs and Services

The complete implementation includes numerous DTO classes, service implementations, and repository interfaces. Key files to create:

### Auth Service DTOs:
- `LoginRequest.java`
- `RegisterRequest.java`
- `AuthResponse.java`
- `UserResponse.java`
- `RefreshTokenRequest.java`
- `ApiResponse.java`

### Tree Service DTOs:
- `TreeDto.java`
- `CreateTreeRequest.java`
- `UpdateTreeRequest.java`
- `TreeResponse.java`
- `TreeSearchParams.java`
- `Location.java`
- `Measurements.java`

### Services to implement:
- `AuthService.java`
- `JwtService.java`
- `TreeService.java`
- `H3Service.java`
- `TreeIdentificationService.java`
- `S3Service.java`

### Repositories:
- `UserRepository.java`
- `TreeRepository.java`
- `TreePhotoRepository.java`

## 🔒 Security Configuration

### Add security configuration in auth-service:
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    // JWT authentication configuration
    // Password encoding
    // CORS configuration
}
```

## 📊 Monitoring and Logging

### Add actuator dependencies for health checks:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

### Configure logging and metrics in each service's `application.yml`.

## 🎯 Next Steps

1. **Implement all DTO classes** according to the frontend interfaces
2. **Add validation** using Bean Validation annotations
3. **Implement JWT security** for protected endpoints
4. **Add error handling** with global exception handlers
5. **Configure AWS S3** for media storage
6. **Add integration tests** for each service
7. **Set up CI/CD pipeline** for automated deployment
8. **Configure monitoring** with Actuator and Micrometer
9. **Add API documentation** with Swagger/OpenAPI

## ⚠️ Important Notes

- Replace all placeholder values (passwords, API keys, etc.) with actual values
- Set up proper environment variables for production
- Configure HTTPS for production deployment
- Implement proper error handling and validation
- Add comprehensive tests for all endpoints
- Set up proper logging and monitoring
- Configure database connection pooling for production
- Implement rate limiting and security measures

This guide provides the complete foundation for connecting your React frontend to a Spring Boot microservices backend. Follow the steps in order and customize the implementation based on your specific requirements.
