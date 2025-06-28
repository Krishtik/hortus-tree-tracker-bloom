# Krish Hortus User-Service

## Overview
This is the user profile microservice for the Krish Hortus platform, built with Spring Boot. It handles user profile management (get/update), password changes, and is secured via JWT authentication.

This service assumes that JWTs are issued by a central `auth-service` and validates them for authorizing requests.

## Features
- Get and update user profiles
- Change user passwords
- Secured endpoints using JWT
- Flyway migrations for schema management
- PostgreSQL database
- Interactive API documentation via Swagger UI

## Architecture
- **Spring Boot 3.x** (Java 17+)
- **PostgreSQL** for data storage
- **Flyway** for database migrations
- **Spring Security** for JWT validation and authorization
- **Springdoc OpenAPI** for Swagger UI

---

## Setup and Running

### 1. Prerequisites
- Java 17 or higher
- Maven
- PostgreSQL (running locally or remotely)
- A running `auth-service` to generate JWTs for testing.

### 2. Configure the Database
- Create a PostgreSQL database (e.g., `krishhortus`).
- Update `src/main/resources/application.properties` with your DB credentials:
  ```properties
  spring.datasource.url=jdbc:postgresql://localhost:5432/krishhortus
  spring.datasource.username=postgres
  spring.datasource.password=yourpassword
  ```
- **Important**: Ensure the JWT secret in `application.properties` matches the one in your `auth-service`:
  ```properties
  jwt.secret=your-super-secret-key-that-is-at-least-256-bits-long
  ```

### 3. Run Database Migrations
This command will set up the necessary tables (`users`, `roles`, etc.) if they don't exist.
```sh
mvn flyway:migrate
```

### 4. Build and Run the Service
```sh
# Build the service
mvn clean install

# Run the service
mvn spring-boot:run
```
The service will start on `http://localhost:8080` (or the port configured in `application.properties`).

---

## How to Test the API

This service uses JWT for security. You **must** provide a valid JWT in the `Authorization` header for all protected endpoints.

### 1. Get a JWT from the Auth-Service
First, use your `auth-service` to log in and get a JWT.

### 2. Open Swagger UI
Navigate to [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html).

### 3. Authorize in Swagger
- Click the **"Authorize"** button at the top of the page.
- In the dialog, enter `Bearer <your_jwt_here>` (e.g., `Bearer eyJhbGci...`).
- Click "Authorize" and then "Close".

### 4. Test the Endpoints
You can now use the interactive API documentation to test the endpoints:

- **`GET /api/user/profile`**: Retrieves the profile of the authenticated user.
- **`PUT /api/user/profile`**: Updates the user's full name and profile image URL.
  - **Example Body**:
    ```json
    {
      "fullName": "New User Name",
      "profileImageUrl": "https://example.com/new-image.png"
    }
    ```
- **`POST /api/user/change-password`**: Changes the user's password.
  - **Example Body**:
    ```json
    {
      "oldPassword": "current-password",
      "newPassword": "new-strong-password"
    }
    ``` 