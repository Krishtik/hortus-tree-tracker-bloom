
# Krish Hortus API - Spring Boot Backend

This is the Spring Boot backend API for the Krish Hortus tree management system. It provides RESTful endpoints for authentication, tree management, and geospatial operations.

## 🚀 Quick Start

### Prerequisites
- Java 17 or higher
- Maven 3.6+ 
- Git

### 1. Clone and Setup
```bash
# Navigate to the backend directory
cd backend/krish-hortus-api

# Install dependencies and compile
mvn clean compile

# Run the application
mvn spring-boot:run
```

### 2. Verify Installation
The API will start on `http://localhost:8080`

Test the connection:
```bash
# Health check
curl http://localhost:8080/api/health

# API info
curl http://localhost:8080/api/info
```

Expected response:
```
Krish Hortus API is running successfully! 🌲
```

## 📋 API Endpoints

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login  
- `POST /api/auth/refresh` - Token refresh
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/logout` - User logout

### Tree Management Endpoints
- `GET /api/trees` - Get all trees (with filtering)
- `POST /api/trees` - Create new tree
- `GET /api/trees/{id}` - Get tree by ID
- `PUT /api/trees/{id}` - Update tree
- `DELETE /api/trees/{id}` - Delete tree
- `GET /api/trees/nearby` - Find nearby trees
- `POST /api/trees/{id}/verify` - Verify tree

### Health & Monitoring
- `GET /api/health` - API health check
- `GET /api/info` - API information
- `GET /actuator/health` - Detailed health status

## 🧪 Testing the API

### Test User Registration
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### Test User Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com", 
    "password": "password123"
  }'
```

### Test Tree Creation
```bash
curl -X POST http://localhost:8080/api/trees \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Oak Tree",
    "category": "FARM",
    "location": {
      "lat": 19.7515,
      "lng": 75.7139,
      "address": "Test Location"
    },
    "scientificName": "Quercus species"
  }'
```

### Test Nearby Trees Query
```bash
curl "http://localhost:8080/api/trees/nearby?lat=19.7515&lng=75.7139&radius=1000&limit=10"
```

## 🔧 Configuration

### Database Configuration
The application uses H2 in-memory database for development. To switch to PostgreSQL:

1. Update `application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/krishhortus
    username: your_username
    password: your_password
  jpa:
    database-platform: org.hibernate.dialect.PostgreSQLDialect
```

2. Ensure PostgreSQL is running and database exists.

### CORS Configuration
CORS is configured to allow requests from:
- `http://localhost:5173` (React development server)
- `https://*.lovable.app` (Lovable hosting)

### File Upload Configuration
- Max file size: 10MB
- Max request size: 50MB
- Allowed types: image/jpeg, image/png, image/gif

## 📁 Project Structure

```
backend/krish-hortus-api/
├── src/main/java/com/krishhortus/
│   ├── Application.java              # Main Spring Boot application
│   ├── controller/
│   │   ├── AuthController.java       # Authentication endpoints
│   │   └── TreeController.java       # Tree management endpoints
│   ├── model/                        # Data models (to be created)
│   ├── service/                      # Business logic (to be created)
│   ├── repository/                   # Data access layer (to be created)
│   └── config/                       # Configuration classes (to be created)
├── src/main/resources/
│   ├── application.yml               # Application configuration
│   └── data.sql                      # Sample data (optional)
├── src/test/                         # Test files
├── pom.xml                          # Maven dependencies
└── README.md                        # This file
```

## 🔨 Development

### Running in Development Mode
```bash
# Start with auto-reload
mvn spring-boot:run

# Or with specific profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Building for Production
```bash
# Create executable JAR
mvn clean package

# Run the JAR
java -jar target/krish-hortus-api-1.0.0.jar
```

### Database Console (H2)
When running in development mode, access the H2 console at:
- URL: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:krishhortus`
- Username: `sa`
- Password: `password`

## 🌐 Frontend Integration

The React frontend should be configured to connect to this API:

### Frontend Environment Variables
```bash
# .env.local in React project
VITE_API_BASE_URL=http://localhost:8080/api
```

### API Client Configuration
The frontend's `apiClient.ts` should use the base URL:
```typescript
const API_BASE_URL = 'http://localhost:8080/api';
```

## 🚀 Next Steps

1. **Implement Database Models**: Create JPA entities for User, Tree, etc.
2. **Add JWT Security**: Implement proper JWT token generation and validation
3. **Create Service Layer**: Add business logic services
4. **Add Data Repositories**: Implement JPA repositories
5. **Integrate H3 Library**: Add real geospatial indexing
6. **Add File Upload**: Implement image upload for tree photos
7. **Add Unit Tests**: Create comprehensive test suite
8. **Setup PostgreSQL**: Configure production database
9. **Add Docker Support**: Create Docker containers
10. **Implement Logging**: Add structured logging

## 🐛 Common Issues

### Port Already in Use
If port 8080 is busy:
```bash
# Kill process on port 8080
lsof -ti:8080 | xargs kill -9

# Or change port in application.yml
server:
  port: 8081
```

### CORS Issues
If frontend can't connect, verify CORS configuration in `application.yml` and ensure the frontend URL is included.

### Database Connection Issues
For PostgreSQL connection issues:
1. Ensure PostgreSQL is running
2. Verify database exists
3. Check username/password credentials
4. Confirm network accessibility

## 📚 Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Data JPA Guide](https://spring.io/guides/gs/accessing-data-jpa/)
- [Spring Security Reference](https://spring.io/projects/spring-security)
- [H3 Geospatial Library](https://h3geo.org/)
- [JWT.io](https://jwt.io/) - For JWT token debugging

## 🤝 Contributing

1. Create feature branch from `main`
2. Make changes with proper documentation
3. Add/update tests as needed
4. Ensure all tests pass
5. Submit pull request with clear description

## 📄 License

This project is part of the Krish Hortus tree management system.
```
