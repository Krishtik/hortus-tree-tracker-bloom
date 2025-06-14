# Krish Hortus - Tree Tagging & Management App

A comprehensive tree identification and management application built with React, TypeScript, and modern web technologies. The app uses AI-powered tree identification, geospatial mapping with H3 indexing, and provides features for forestry management across farm, community, and nursery categories.

## 🌳 Overview

Krish Hortus is a Progressive Web App (PWA) that allows users to:

- Tag and identify trees using AI-powered image recognition
- Track tree locations with precise geospatial coordinates (H3 indexing)
- Manage trees across different forestry categories
- Drag and drop markers to update tree locations in real-time
- Click on map locations to add new trees
- View detailed tree information and photos
- Hierarchical tree management with real-time data

## 📁 Project Structure

### `/src` - Main Source Directory

#### `/components` - Reusable UI Components

##### `/auth` - Authentication Components

- **AuthModal.tsx**: Modal for user login/signup with form validation
  - **Backend Integration**: Connect to `/api/auth/login` and `/api/auth/register` endpoints
  - **Required Microservice**: `auth-service` for user authentication and JWT token management

##### `/camera` - Camera and Photo Capture

- **CameraCapture.tsx**: Native camera integration for photo capture with real-time preview
  - **Backend Integration**: Image upload to AWS S3 via `/api/upload/photos` endpoint
  - **Required Microservice**: `media-service` for file storage and image processing

##### `/map` - Map Components (Modular Map System)

- **OSMTreeMap.tsx**: Main OpenStreetMap component using Leaflet

  - **Functions**:
    - `getCurrentLocation()`: Gets user's precise location with fallback
    - `handleMarkerDragEnd()`: Updates tree coordinates when dragged → **Backend**: `PUT /api/trees/{id}/location`
    - `handleMapClick()`: Opens tree form when map is clicked
    - `MapClickHandler`: Event handler component for map clicks
  - **Data Flow**: `trees[]` → `TreeMarker` → `TreeContext.updateTree()` → **Backend**: Tree Service
  - **Backend Integration**: Real-time location updates via WebSocket or polling
  - **Required Microservice**: `location-service` for geospatial operations and H3 indexing

- **TreeMarker.tsx**: Individual tree marker component with enhanced UI

  - **Functions**:
    - `createTreeIcon()`: Generates colored icons based on tree category with verification badges
    - `handleDragEnd()`: Handles marker drag completion → **Backend**: Location update API
  - **Props**: `tree`, `onTreeClick`, `onDragEnd`, `isDragging`, `onDragStart`
  - **Real-time Updates**: Marker position updates immediately via Leaflet, data syncs with backend
  - **Backend Integration**: Tree status updates, verification badges from `verification-service`

- **UserLocationMarker.tsx**: User's current location marker

  - **Functions**: `createUserIcon()`: Creates red marker for user location
  - **Props**: `position: [lat, lng]`, `address: string`
  - **Backend Integration**: User location tracking via `user-service`

- **MapControls.tsx**: Floating action buttons for map interactions

  - **Functions**: Settings button, Locate user button (removed camera button as requested)
  - **Props**: `onSettingsClick`, `onLocateClick`, `isLocating`
  - **Backend Integration**: User preferences storage via `user-service`

- **SatelliteToggle.tsx**: Enhanced satellite/street view toggle button

  - **Functions**: Toggle between map layers with improved positioning matching settings button height
  - **Backend Integration**: User map preferences via `user-service/preferences`

- **MapUpdater.tsx**: Handles smooth map animations

  - **Functions**: `flyTo()`: Animates map to new center with smooth transition
  - **Props**: `center: [lat, lng]`

- **MapSettings.tsx**: Map configuration panel
- **TreeMap.tsx**: Alternative Google Maps implementation (fallback)

##### `/navigation` - Navigation Components

- **BottomNavigation.tsx**: Mobile-first bottom tab navigation
- **EnhancedNavigation.tsx**: Enhanced header with notifications and tabs

##### `/notifications` - Notification System

- **NotificationModal.tsx**: In-app notification center
  - **Backend Integration**: Real-time notifications via WebSocket from `notification-service`

##### `/profile` - User Profile Management

- **ProfileView.tsx**: User profile display with real-time statistics
  - **Backend Integration**: User profile data from `user-service`, tree statistics from `analytics-service`
  - **API Endpoints**:
    - `GET /api/users/profile` - Get user profile
    - `PUT /api/users/profile` - Update user profile
    - `GET /api/analytics/user/{userId}/stats` - Get user tree statistics

##### `/settings` - Application Settings

- **GoogleMapsSettings.tsx**: Google Maps API key configuration

##### `/tree` - Tree Management Components

- **TreeForm.tsx**: Comprehensive tree data entry form

  - **Functions**:
    - `handleAIIdentification()`: Processes uploaded images through AI service → **Backend**: `POST /api/ai/identify`
    - `handlePhotoCapture()`: Manages camera photo capture → **Backend**: `POST /api/upload/photos`
    - `handleFileUpload()`: Handles multiple photo uploads → **Backend**: Media service
    - `handleFormSubmit()`: Validates and submits tree data → **Backend**: `POST /api/trees`
  - **AI Integration**: Connects to `ai-service` for automatic tree identification
  - **Data Flow**: Form Data → `TreeFormData` → `TreeContext.addTree()` → **Backend**: Tree Service
  - **Required Microservice**: `ai-service` for tree identification using Google Gemini API

- **TreeDetailModal.tsx**: Detailed tree information display

  - **Backend Integration**: Real-time tree data updates via `tree-service`

- **TreeLogView.tsx**: Enhanced analytics dashboard with real-time data

  - **Functions**: Displays forestry categories, statistics, and tree management
  - **Backend Integration**:
    - `GET /api/analytics/forestry-stats` - Get forestry category statistics
    - `GET /api/trees/user/{userId}` - Get user's trees
    - `GET /api/analytics/verification-stats` - Get verification statistics
  - **Features**: Real-time data display, removed '+' from log button as requested

- **HierarchicalTreeView.tsx**: Tree management in hierarchical format with real data

  - **Functions**: Search, filter, bulk actions on real tree data
  - **Backend Integration**:
    - `GET /api/trees/hierarchical` - Get trees in hierarchical format
    - `POST /api/trees/bulk-action` - Perform bulk operations
    - `PUT /api/trees/bulk-update` - Bulk update tree properties
  - **Features**: Uses real tree data from TreeContext, categorized by forestry types

- **TreeScanModal.tsx**: Modal wrapper for tree scanning workflow

##### `/ui` - Shadcn/UI Components

- All reusable UI components (buttons, dialogs, forms, etc.)

#### `/contexts` - React Context Providers

##### **AuthContext.tsx**

- **Purpose**: Manages user authentication state
- **Functions**:
  - `login()`: Authenticates user credentials → **Backend**: `POST /api/auth/login`
  - `logout()`: Clears user session → **Backend**: `POST /api/auth/logout`
  - `register()`: Creates new user account → **Backend**: `POST /api/auth/register`
- **State**: `user`, `isAuthenticated`, `loading`
- **Backend Integration**: JWT token management with `auth-service`
- **Required Microservice**: `auth-service` with endpoints:
  - `POST /api/auth/login` - User login
  - `POST /api/auth/register` - User registration
  - `POST /api/auth/refresh` - Token refresh
  - `POST /api/auth/logout` - User logout
  - `GET /api/auth/profile` - Get user profile

##### **TreeContext.tsx** ⚠️ **File is 329 lines - Consider refactoring**

- **Purpose**: Central state management for all tree data
- **Functions**:
  - `addTree(treeData, location)`: Creates new tree entry
    - **Backend**: `POST /api/trees` with tree data and location
    - Generates H3 index from coordinates
    - Handles photo uploads via media service
    - Real-time notification via notification service
  - `updateTree(id, updates)`: Updates existing tree data
    - **Backend**: `PUT /api/trees/{id}` or `PATCH /api/trees/{id}`
    - **Critical for drag functionality**: Updates lat/lng/h3Index when marker is dragged
    - Real-time sync across all components
  - `deleteTree(id)`: Removes tree from system → **Backend**: `DELETE /api/trees/{id}`
  - `getTreesInArea(h3Index)`: Spatial queries using H3 indexing → **Backend**: `GET /api/trees/area/{h3Index}`
  - `searchTrees(params)`: Filtered tree searches → **Backend**: `GET /api/trees/search`
- **State**: `trees[]`, `userTrees[]`, `loading`, `error`
- **Backend Integration**: Primary integration with `tree-service`
- **Required Microservice**: `tree-service` with endpoints:
  - `GET /api/trees` - Get all trees with filtering
  - `POST /api/trees` - Create new tree
  - `GET /api/trees/{id}` - Get tree by ID
  - `PUT /api/trees/{id}` - Update tree
  - `DELETE /api/trees/{id}` - Delete tree
  - `GET /api/trees/nearby` - Get nearby trees
  - `POST /api/trees/{id}/verify` - Verify tree
  - `GET /api/trees/search` - Search trees
  - `GET /api/trees/area/{h3Index}` - Get trees in area

#### `/hooks` - Custom React Hooks

- **use-mobile.tsx**: Responsive design utilities
- **use-toast.ts**: Toast notification management

#### `/lib` - Utility Libraries

- **utils.ts**: Common utility functions and helpers

#### `/pages` - Page Components

##### **Index.tsx**

- **Purpose**: Main application shell and routing
- **Functions**:
  - `handleTreeClick()`: Opens tree detail modal
  - `handleTabChange()`: Navigation between app sections
  - `renderTabContent()`: Conditional rendering based on active tab
- **Routing**: Manages navigation between Home, Log, Profile views (removed Scan tab as requested)
- **Data Flow**: Receives `trees[]` from TreeContext → Passes to OSMTreeMap

##### **NotFound.tsx**

- 404 error page for invalid routes

#### `/services` - External Service Integrations

##### **aiService.ts**

- **Purpose**: AI-powered tree identification using Google Gemini API
- **Functions**:
  - `identifyTree(imageFile)`: Main identification function
    - Converts image to base64
    - Calls Gemini API with vision model
    - Returns structured tree data
  - `callGeminiAPI()`: Direct API communication
  - `enhanceWithWikipedia()`: Enriches data with Wikipedia information
  - `getMockResult()`: Fallback identification data
- **Backend Integration**: Should be moved to `ai-service` microservice
- **Required Microservice**: `ai-service` with endpoints:
  - `POST /api/ai/identify` - Identify tree from image
  - `POST /api/ai/analyze` - Analyze tree health
  - `GET /api/ai/species-info/{species}` - Get species information

##### **apiClient.ts**

- **Purpose**: HTTP client for backend API communication
- **Functions**: GET, POST, PUT, DELETE operations with authentication
- **Features**: JWT token management, error handling, request/response interceptors
- **Backend Integration**: Central HTTP client for all microservices communication

##### **authService.ts**

- **Purpose**: Authentication API endpoints
- **Functions**: Login, logout, registration, token management
- **Backend Integration**: Direct integration with `auth-service`

##### **treeService.ts**

- **Purpose**: Tree data API operations
- **Functions**:
  - `getAllTrees()`: Fetches all trees with optional filters → **Backend**: `GET /api/trees`
  - `getTreeById()`: Single tree retrieval → **Backend**: `GET /api/trees/{id}`
  - `createTree()`: Creates new tree entry → **Backend**: `POST /api/trees`
  - `updateTree()`: Updates existing tree → **Backend**: `PUT /api/trees/{id}`
  - `deleteTree()`: Removes tree → **Backend**: `DELETE /api/trees/{id}`
  - `getNearbyTrees()`: Spatial queries → **Backend**: `GET /api/trees/nearby`
  - `uploadTreePhotos()`: Handles photo uploads → **Backend**: `POST /api/upload/photos`
  - `getFallbackTrees()`: localStorage fallback
- **Backend Integration**: Primary service for tree operations
- **Data Persistence**: Backend API with localStorage fallback for offline support

#### `/types` - TypeScript Type Definitions

##### **tree.ts**

- **Purpose**: Core data structures for tree entities
- **Types**:
  - `Tree`: Complete tree object with location, measurements, photos, metadata
  - `TreeFormData`: Form input structure for tree creation
- **Key Fields**:
  - `location`: `{ lat, lng, h3Index, address }` - Critical for geospatial operations
  - `category`: Enhanced to support: `'farm' | 'community' | 'nursery' | 'extension' | 'ngo-collaboration'`
  - `measurements`: Height, trunk width, canopy spread
  - `photos`: Multiple image URLs (tree, leaves, bark, fruit, flower)
  - `metadata`: Taxonomy, uses, medicinal benefits, verification status

#### `/config` - Configuration Files

- **api.ts**: API endpoints and configuration constants
  - **Backend Integration**: Centralized API endpoint configuration
  - **Environment Variables**: Support for different environments (dev, staging, prod)

### Root Files

- **App.tsx**: Main application component with providers and routing
- **main.tsx**: Application entry point
- **index.css**: Global styles and Tailwind CSS imports

## 🔄 Data Flow Architecture

### Tree Dragging & Real-time Updates

1. **User Interaction**: User drags TreeMarker on map
2. **Event Handling**: `TreeMarker.handleDragEnd()` captures new coordinates
3. **H3 Generation**: New H3 index calculated from lat/lng using `latLngToCell()`
4. **Context Update**: `TreeContext.updateTree()` called with new location data
5. **Backend Sync**: `PUT /api/trees/{id}/location` updates database
6. **State Update**: TreeContext state updates, triggering re-render
7. **Visual Update**: All components using tree data refresh automatically
8. **Popup Update**: Marker popup shows updated coordinates and H3 index

### Map Click Tree Addition

1. **Map Click**: `MapClickHandler` captures click coordinates
2. **Form Modal**: TreeForm opens with clicked location pre-filled
3. **AI Processing**: Image upload triggers `POST /api/ai/identify`
4. **Data Enhancement**: Wikipedia API enriches tree information
5. **Form Submission**: Complete tree data submitted via `POST /api/trees`
6. **Persistence**: Data saved to database via tree-service
7. **Map Update**: New marker appears immediately on map

### Cross-Component Communication

- **TreeContext**: Central hub for all tree-related state
- **AuthContext**: User authentication state shared globally
- **React Query**: Caching and synchronization for API calls
- **Event Handlers**: Props drilling for user interactions
- **Custom Hooks**: Reusable logic (mobile detection, toast notifications)

## 🚀 Key Features

### Real-time Geolocation Updates

- **H3 Indexing**: Precise geospatial positioning using Uber's H3 system (Resolution 15: ~0.895 m²)
- **Drag & Drop**: Live marker repositioning with instant coordinate updates
- **Address Resolution**: Automatic reverse geocoding using OpenStreetMap Nominatim

### AI-Powered Tree Identification

- **Google Gemini Integration**: Advanced image recognition using Gemini 1.5 Flash
- **Multi-language Support**: Hindi and English tree names
- **Wikipedia Enhancement**: Automatic data enrichment
- **Taxonomy Classification**: Complete scientific classification

### Enhanced Forestry Management

- **Farm Forestry**: Agricultural tree management
- **Community Forestry**: Public space trees
- **Nursery**: Seedling and propagation tracking
- **Extension Forestry**: Urban and roadside plantations (coming soon)
- **NGO Collaborations**: Partnership projects (coming soon)

### Improved UI/UX Features

- **Enhanced Map Controls**: Satellite/street view button positioned at equal height with settings button
- **Improved Tree Markers**: Verification badges, category colors, detailed popups
- **Real Data Integration**: HierarchicalTreeView and TreeLogView use actual user data
- **Removed Elements**: '+' symbol from log button as requested

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Maps**: Leaflet, React-Leaflet, OpenStreetMap
- **Geospatial**: H3-js for hexagonal indexing
- **UI Framework**: Tailwind CSS, Shadcn/UI
- **State Management**: React Context, TanStack Query
- **AI Integration**: Google Gemini API
- **Authentication**: JWT-based auth system
- **Data Persistence**: Backend API with localStorage fallback

## 🏗️ Backend Integration Guide - Spring Boot Microservices

### Architecture Overview

```
Frontend (React) ↔ API Gateway ↔ Microservices ↔ PostgreSQL (AWS RDS)
                                      ↓
                                 AWS S3 (Media)
```

### Required Microservices

#### 1. **API Gateway Service** (`api-gateway`)

```yaml
Port: 8080
Dependencies: Spring Cloud Gateway, Eureka Client
```

**Configuration**:

- Route requests to appropriate microservices
- Handle CORS, rate limiting, and authentication
- Load balancing across service instances

**Routes to Configure**:

```yaml
- /api/auth/** → auth-service
- /api/trees/** → tree-service
- /api/ai/** → ai-service
- /api/upload/** → media-service
- /api/analytics/** → analytics-service
- /api/users/** → user-service
```

#### 2. **Authentication Service** (`auth-service`)

```yaml
Port: 8081
Database: auth_db
Dependencies: Spring Security, JWT, PostgreSQL
```

**Entities to Create**:

```java
@Entity
public class User {
    @Id @GeneratedValue
    private Long id;
    private String email;
    private String password; // BCrypt hashed
    private String name;
    private String role; // ADMIN, USER
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;
    private boolean isActive;
}

@Entity
public class RefreshToken {
    @Id
    private String token;
    private Long userId;
    private LocalDateTime expiryDate;
}
```

**Controllers to Implement**:

```java
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @PostMapping("/login")
    @PostMapping("/register")
    @PostMapping("/refresh")
    @PostMapping("/logout")
    @GetMapping("/profile")
}
```

**Key Files to Create**:

- `src/main/java/com/krishhortus/auth/entity/User.java`
- `src/main/java/com/krishhortus/auth/repository/UserRepository.java`
- `src/main/java/com/krishhortus/auth/service/AuthService.java`
- `src/main/java/com/krishhortus/auth/controller/AuthController.java`
- `src/main/java/com/krishhortus/auth/config/JwtConfig.java`

#### 3. **Tree Service** (`tree-service`)

```yaml
Port: 8082
Database: tree_db
Dependencies: PostgreSQL, H3-Java, PostGIS
```

**Entities to Create**:

```java
@Entity
public class Tree {
    @Id
    private String id; // UUID
    private String name;
    private String scientificName;
    private String localName;
    @Enumerated(EnumType.STRING)
    private TreeCategory category; // FARM, COMMUNITY, NURSERY, EXTENSION, NGO_COLLABORATION

    @Embedded
    private Location location;

    @Embedded
    private Measurements measurements;

    @OneToMany(mappedBy = "tree", cascade = CascadeType.ALL)
    private List<TreePhoto> photos;

    private String taggedBy; // User ID
    private LocalDateTime taggedAt;
    private boolean isAIGenerated;
    private boolean isVerified;
    private String verifiedBy;
    private LocalDateTime verifiedAt;
}

@Embeddable
public class Location {
    private Double latitude;
    private Double longitude;
    private String h3Index;
    private String address;
}

@Entity
public class TreePhoto {
    @Id @GeneratedValue
    private Long id;
    private String treeId;
    private String photoType; // TREE, LEAVES, BARK, FRUIT, FLOWER
    private String s3Url;
    private String thumbnailUrl;
}
```

**Controllers to Implement**:

```java
@RestController
@RequestMapping("/api/trees")
public class TreeController {
    @GetMapping
    @PostMapping
    @GetMapping("/{id}")
    @PutMapping("/{id}")
    @DeleteMapping("/{id}")
    @GetMapping("/nearby")
    @GetMapping("/area/{h3Index}")
    @PostMapping("/{id}/verify")
    @GetMapping("/search")
}
```

**Key Files to Create**:

- `src/main/java/com/krishhortus/tree/entity/Tree.java`
- `src/main/java/com/krishhortus/tree/repository/TreeRepository.java`
- `src/main/java/com/krishhortus/tree/service/TreeService.java`
- `src/main/java/com/krishhortus/tree/service/H3Service.java`
- `src/main/java/com/krishhortus/tree/controller/TreeController.java`

#### 4. **AI Service** (`ai-service`)

```yaml
Port: 8083
Dependencies: Google Gemini API, OpenAI API
```

**Controllers to Implement**:

```java
@RestController
@RequestMapping("/api/ai")
public class AIController {
    @PostMapping("/identify")
    @PostMapping("/analyze")
    @GetMapping("/species-info/{species}")
}
```

**Key Files to Create**:

- `src/main/java/com/krishhortus/ai/service/GeminiService.java`
- `src/main/java/com/krishhortus/ai/service/TreeIdentificationService.java`
- `src/main/java/com/krishhortus/ai/controller/AIController.java`
- `src/main/java/com/krishhortus/ai/config/GeminiConfig.java`

#### 5. **Media Service** (`media-service`)

```yaml
Port: 8084
Dependencies: AWS S3, ImageIO
```

**Controllers to Implement**:

```java
@RestController
@RequestMapping("/api/upload")
public class MediaController {
    @PostMapping("/photos")
    @GetMapping("/presigned-url")
    @DeleteMapping("/photos/{photoId}")
}
```

**Key Files to Create**:

- `src/main/java/com/krishhortus/media/service/S3Service.java`
- `src/main/java/com/krishhortus/media/service/ImageProcessingService.java`
- `src/main/java/com/krishhortus/media/controller/MediaController.java`

#### 6. **Analytics Service** (`analytics-service`)

```yaml
Port: 8085
Database: analytics_db
Dependencies: PostgreSQL, Micrometer
```

**Controllers to Implement**:

```java
@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {
    @GetMapping("/forestry-stats")
    @GetMapping("/user/{userId}/stats")
    @GetMapping("/verification-stats")
    @GetMapping("/regional")
}
```

#### 7. **User Service** (`user-service`)

```yaml
Port: 8086
Database: user_db
Dependencies: PostgreSQL
```

**Controllers to Implement**:

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    @GetMapping("/profile")
    @PutMapping("/profile")
    @GetMapping("/{userId}/preferences")
    @PutMapping("/{userId}/preferences")
}
```

### Database Schema (PostgreSQL)

#### Tree Database Tables:

```sql
-- Trees table
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

-- Indexes for spatial queries
CREATE INDEX idx_trees_h3_index ON trees(h3_index);
CREATE INDEX idx_trees_location ON trees(latitude, longitude);
CREATE INDEX idx_trees_category ON trees(category);
CREATE INDEX idx_trees_tagged_by ON trees(tagged_by);

-- Tree photos table
CREATE TABLE tree_photos (
    id BIGSERIAL PRIMARY KEY,
    tree_id VARCHAR(36) REFERENCES trees(id) ON DELETE CASCADE,
    photo_type VARCHAR(20) NOT NULL,
    s3_url VARCHAR(512) NOT NULL,
    thumbnail_url VARCHAR(512),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### AWS Configuration

#### RDS PostgreSQL Setup:

1. Create RDS PostgreSQL instance
2. Enable PostGIS extension for geospatial queries
3. Configure VPC and security groups
4. Set up read replicas for analytics

#### S3 Configuration:

1. Create S3 bucket for tree photos
2. Configure CORS for frontend uploads
3. Set up CloudFront distribution for image delivery
4. Implement lifecycle policies for cost optimization

### Environment Configuration

#### application.yml for each service:

```yaml
# Common configuration
spring:
  application:
    name: tree-service
  datasource:
    url: jdbc:postgresql://${DB_HOST:localhost}:5432/${DB_NAME:tree_db}
    username: ${DB_USERNAME:postgres}
    password: ${DB_PASSWORD:password}
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false

# Service-specific configuration
server:
  port: 8082

# H3 configuration
h3:
  resolution: 15

# AWS configuration
aws:
  region: ${AWS_REGION:us-east-1}
  s3:
    bucket: ${S3_BUCKET:krish-hortus-media}
```

### Frontend Integration Points

#### Update apiClient.ts:

```typescript
// Add environment-specific base URLs
const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  WEBSOCKET_URL: import.meta.env.VITE_WS_BASE_URL || "ws://localhost:8080/ws",
};
```

#### Update treeService.ts for real backend:

```typescript
// Remove localStorage fallback in production
// Add real-time updates via WebSocket
// Implement proper error handling
// Add retry logic for failed requests
```

### Deployment Strategy

#### Docker Configuration:

Create `Dockerfile` for each service:

```dockerfile
FROM openjdk:17-jdk-slim
COPY target/*.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

#### Kubernetes Deployment:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: tree-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: tree-service
  template:
    metadata:
      labels:
        app: tree-service
    spec:
      containers:
        - name: tree-service
          image: krishhortus/tree-service:latest
          ports:
            - containerPort: 8082
          env:
            - name: DB_HOST
              value: "postgres-service"
```

### Testing Strategy

#### Integration Tests:

- Create test databases for each service
- Test API endpoints with real data
- Test H3 geospatial operations
- Test image upload and processing

#### Frontend Testing:

- Update tests to use mock backend responses
- Test real-time updates
- Test offline functionality with localStorage fallback

## 📱 Multi-Device Compatibility

The application is fully responsive and tested across:

- **Mobile Devices**: Touch-optimized controls, bottom navigation
- **Tablets**: Hybrid interface with both mobile and desktop features
- **Desktop**: Full feature set with keyboard and mouse optimization

## 🔧 Installation & Setup

1. **Clone Repository**

   ```bash
   git clone <repository-url>
   cd krish-hortus
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   - Configure Google Gemini API key in `aiService.ts`
   - Set up backend API endpoints in `config/api.ts`
   - Configure AWS credentials for S3 integration

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## 🚦 Usage

1. **Authentication**: Sign up/login to access features
2. **Location Permission**: Allow location access for precise mapping
3. **Tree Tagging**:
   - Click map location to add tree
   - Take photo or upload image
   - AI automatically identifies tree species
   - Fill additional details and save
4. **Map Interactions**:
   - View all tagged trees with enhanced category-colored markers
   - Drag markers to update locations
   - Click markers for detailed information with verification badges
5. **Management**: View, edit, and organize your tree collection using hierarchical tree view

## 🤝 Contributing

The codebase is modular and well-structured for easy contribution:

- Each component has a single responsibility
- Clear separation between UI, logic, and data layers
- TypeScript ensures type safety
- Comprehensive prop interfaces for component communication
- Backend-ready architecture with clear integration points

## 📄 License

[Add your license information here]

---

**Built with ❤️ for sustainable forestry management and real-time environmental monitoring**
