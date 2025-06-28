# Krish Hortus Auth-Service

## Overview
This is the authentication microservice for the Krish Hortus platform, built with Spring Boot. It handles user registration, login, JWT authentication, refresh tokens, and user profile management in a secure, production-ready way.

## Features
- User registration and login
- JWT-based authentication
- Secure refresh token flow (DB-backed)
- User profile endpoint
- Logout and token invalidation
- Role-based access (USER, ADMIN, MODERATOR)
- Flyway migrations for schema management
- PostgreSQL database
- Robust error handling and validation

## Architecture
- **Spring Boot 3.x** (Java 17+)
- **PostgreSQL** for persistent storage
- **Flyway** for database migrations
- **Spring Security** for authentication/authorization
- **RESTful API** endpoints

## Setup Instructions (For Spring Boot Beginners)

### Prerequisites
- Java 17 or higher
- Maven
- PostgreSQL (running locally or remotely)

### 1. Clone the Repository
```sh
git clone <your-repo-url>
cd hortus-tree-tracker-bloom/backend/auth-service
```

### 2. Configure the Database
- Create a PostgreSQL database (e.g., `krishhortus`).
- Update `src/main/resources/application.properties` with your DB credentials:
  ```properties
  spring.datasource.url=jdbc:postgresql://localhost:5432/krishhortus
  spring.datasource.username=postgres
  spring.datasource.password=yourpassword
  ```

### 3. Run Database Migrations
```sh
mvn flyway:migrate
```
This will create all required tables automatically.

### 4. Build and Run the Service
```sh
mvn clean compile
mvn spring-boot:run
```
The service will start on [http://localhost:8080](http://localhost:8080).

## How to Test Endpoints
Use [Postman](https://www.postman.com/) or cURL:

### Register
POST `/api/auth/register`
```json
{
  "username": "testuser",
  "email": "testuser@example.com",
  "password": "password123"
}
```

### Login
POST `/api/auth/login`
```json
{
  "username": "testuser",
  "password": "password123"
}
```

### Refresh Token
POST `/api/auth/refresh`
```json
{
  "refreshToken": "<refresh_token_from_login>"
}
```

### Get Profile
GET `/api/auth/profile` (add Bearer token from login)

### Logout
POST `/api/auth/logout` (add Bearer token)

## Environment/Configuration
- All config is in `src/main/resources/application.properties`.
- JWT secret and expiration, DB credentials, and Flyway settings are here.

## Production Best Practices
- Use strong, random JWT secrets (never commit real secrets).
- Use HTTPS in production.
- Set up logging, monitoring, and backups.
- Rotate and invalidate refresh tokens on logout.
- Use environment variables for secrets in production.
- Regularly update dependencies.

## Contribution Guide
- Fork the repo and create a feature branch.
- Write clear, commented code.
- Add/modify Flyway migrations for DB changes.
- Test endpoints before submitting PRs.

## Troubleshooting
- **DB errors:** Check your DB is running and credentials are correct.
- **Port in use:** Change `server.port` in `application.properties`.
- **JWT errors:** Ensure your JWT secret is set and matches in all services.

## License
MIT (or your license here)

---

# Next Steps & Plans
See `NEXT_PLAN.md` for the current roadmap and next actions for this and other services. 