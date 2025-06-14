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

## 📁 Project Structure

### `/src` - Main Source Directory

#### `/components` - Reusable UI Components

##### `/auth` - Authentication Components

- **AuthModal.tsx**: Modal for user login/signup with form validation

##### `/camera` - Camera and Photo Capture

- **CameraCapture.tsx**: Native camera integration for photo capture with real-time preview

##### `/map` - Map Components (Modular Map System)

- **OSMTreeMap.tsx**: Main OpenStreetMap component using Leaflet

  - Functions:
    - `getCurrentLocation()`: Gets user's precise location with fallback
    - `handleMarkerDragEnd()`: Updates tree coordinates when dragged
    - `handleMapClick()`: Opens tree form when map is clicked
    - `MapClickHandler`: Event handler component for map clicks
  - Data Flow: `trees[]` → `TreeMarker` → `TreeContext.updateTree()`

- **TreeMarker.tsx**: Individual tree marker component

  - Functions:
    - `createTreeIcon()`: Generates colored icons based on tree category
    - `handleDragEnd()`: Handles marker drag completion
  - Props: `tree`, `onTreeClick`, `onDragEnd`, `isDragging`, `onDragStart`
  - Real-time Updates: Marker position updates immediately via Leaflet, data updates via TreeContext

- **UserLocationMarker.tsx**: User's current location marker

  - Functions: `createUserIcon()`: Creates red marker for user location
  - Props: `position: [lat, lng]`, `address: string`

- **MapControls.tsx**: Floating action buttons for map interactions

  - Functions: Camera button, Settings button, Locate user button
  - Props: `onCameraClick`, `onSettingsClick`, `onLocateClick`, `isLocating`

- **MapUpdater.tsx**: Handles smooth map animations

  - Functions: `flyTo()`: Animates map to new center with smooth transition
  - Props: `center: [lat, lng]`

- **MapSettings.tsx**: Map configuration panel
- **TreeMap.tsx**: Alternative Google Maps implementation (fallback)

##### `/navigation` - Navigation Components

- **BottomNavigation.tsx**: Mobile-first bottom tab navigation
- **EnhancedNavigation.tsx**: Enhanced header with notifications and tabs

##### `/notifications` - Notification System

- **NotificationModal.tsx**: In-app notification center

##### `/profile` - User Profile Management

- **ProfileView.tsx**: User profile display and editing

##### `/settings` - Application Settings

- **GoogleMapsSettings.tsx**: Google Maps API key configuration

##### `/tree` - Tree Management Components

- **TreeForm.tsx**: Comprehensive tree data entry form

  - Functions:
    - `handleAIIdentification()`: Processes uploaded images through AI service
    - `handlePhotoCapture()`: Manages camera photo capture
    - `handleFileUpload()`: Handles multiple photo uploads (tree, leaves, bark, fruit, flower)
    - `handleFormSubmit()`: Validates and submits tree data
  - AI Integration: Connects to `aiService.identifyTree()` for automatic tree identification
  - Data Flow: Form Data → `TreeFormData` → `TreeContext.addTree()` → Backend/LocalStorage

- **TreeDetailModal.tsx**: Detailed tree information display
- **TreeLogView.tsx**: List view of user's tagged trees
- **TreeScanModal.tsx**: Modal wrapper for tree scanning workflow

##### `/ui` - Shadcn/UI Components

- All reusable UI components (buttons, dialogs, forms, etc.)

#### `/contexts` - React Context Providers

##### **AuthContext.tsx**

- **Purpose**: Manages user authentication state
- **Functions**:
  - `login()`: Authenticates user credentials
  - `logout()`: Clears user session
  - `register()`: Creates new user account
- **State**: `user`, `isAuthenticated`, `loading`
- **Data Flow**: AuthContext → All components requiring auth state

##### **TreeContext.tsx**

- **Purpose**: Central state management for all tree data
- **Functions**:
  - `addTree(treeData, location)`: Creates new tree entry
    - Generates H3 index from coordinates
    - Handles photo uploads and URL creation
    - Fallback to localStorage if backend fails
  - `updateTree(id, updates)`: Updates existing tree data
    - **Critical for drag functionality**: Updates lat/lng/h3Index when marker is dragged
    - Real-time sync across all components
  - `deleteTree(id)`: Removes tree from system
  - `getTreesInArea(h3Index)`: Spatial queries using H3 indexing
  - `searchTrees(params)`: Filtered tree searches
- **State**: `trees[]`, `userTrees[]`, `loading`, `error`
- **Data Sources**:
  - Primary: Backend API via `treeService`
  - Fallback: Browser localStorage
  - Demo: Sample trees for testing
- **Real-time Updates**: When `updateTree()` is called from marker drag, all components re-render with new data

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
  - `handleCameraClick()`: Launches tree scanning workflow
  - `handleTabChange()`: Navigation between app sections
  - `renderTabContent()`: Conditional rendering based on active tab
- **Routing**: Manages navigation between Home, Scan, Log, Profile views
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
- **API Integration**: Google Gemini 1.5 Flash with vision capabilities
- **Data Flow**: Image File → Base64 → Gemini API → Structured Tree Data → TreeForm

##### **apiClient.ts**

- **Purpose**: HTTP client for backend API communication
- **Functions**: GET, POST, PUT, DELETE operations with authentication

##### **authService.ts**

- **Purpose**: Authentication API endpoints
- **Functions**: Login, logout, registration, token management

##### **treeService.ts**

- **Purpose**: Tree data API operations
- **Functions**:
  - `getAllTrees()`: Fetches all trees with optional filters
  - `getTreeById()`: Single tree retrieval
  - `createTree()`: Creates new tree entry
  - `updateTree()`: Updates existing tree (used by drag functionality)
  - `deleteTree()`: Removes tree
  - `getNearbyTrees()`: Spatial queries
  - `uploadTreePhotos()`: Handles photo uploads
  - `getFallbackTrees()`: localStorage fallback
- **Data Flow**: TreeContext ↔ treeService ↔ Backend API / localStorage

#### `/types` - TypeScript Type Definitions

##### **tree.ts**

- **Purpose**: Core data structures for tree entities
- **Types**:
  - `Tree`: Complete tree object with location, measurements, photos, metadata
  - `TreeFormData`: Form input structure for tree creation
- **Key Fields**:
  - `location`: `{ lat, lng, h3Index, address }` - Critical for geospatial operations
  - `category`: `'farm' | 'community' | 'nursery'` - Forestry classification
  - `measurements`: Height, trunk width, canopy spread
  - `photos`: Multiple image URLs (tree, leaves, bark, fruit, flower)
  - `metadata`: Taxonomy, uses, medicinal benefits

#### `/config` - Configuration Files

- **api.ts**: API endpoints and configuration constants

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
5. **Service Layer**: `treeService.updateTree()` syncs with backend/localStorage
6. **State Update**: TreeContext state updates, triggering re-render
7. **Visual Update**: All components using tree data refresh automatically
8. **Popup Update**: Marker popup shows updated coordinates and H3 index

### Map Click Tree Addition

1. **Map Click**: `MapClickHandler` captures click coordinates
2. **Form Modal**: TreeForm opens with clicked location pre-filled
3. **AI Processing**: Image upload triggers `aiService.identifyTree()`
4. **Data Enhancement**: Wikipedia API enriches tree information
5. **Form Submission**: Complete tree data submitted via `TreeContext.addTree()`
6. **Persistence**: Data saved to backend/localStorage
7. **Map Update**: New marker appears immediately on map

### Cross-Component Communication

- **TreeContext**: Central hub for all tree-related state
- **AuthContext**: User authentication state shared globally
- **React Query**: Caching and synchronization for API calls
- **Event Handlers**: Props drilling for user interactions
- **Custom Hooks**: Reusable logic (mobile detection, toast notifications)

## 🚀 Key Features

### Real-time Geolocation Updates

- **H3 Indexing**: Precise geospatial positioning using Uber's H3 system
- **Drag & Drop**: Live marker repositioning with instant coordinate updates
- **Address Resolution**: Automatic reverse geocoding using OpenStreetMap Nominatim

### AI-Powered Tree Identification

- **Google Gemini Integration**: Advanced image recognition using Gemini 1.5 Flash
- **Multi-language Support**: Hindi and English tree names
- **Wikipedia Enhancement**: Automatic data enrichment
- **Taxonomy Classification**: Complete scientific classification

### Responsive Design

- **Mobile-First**: Optimized for mobile, tablet, and desktop
- **PWA Features**: Offline capable, installable
- **Touch Interactions**: Gesture support for mobile users

### Forestry Categories

- **Farm Forestry**: Agricultural tree management
- **Community Forestry**: Public space trees
- **Nursery Forestry**: Seedling and propagation tracking

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Maps**: Leaflet, React-Leaflet, OpenStreetMap
- **Geospatial**: H3-js for hexagonal indexing
- **UI Framework**: Tailwind CSS, Shadcn/UI
- **State Management**: React Context, TanStack Query
- **AI Integration**: Google Gemini API
- **Authentication**: JWT-based auth system
- **Data Persistence**: Backend API with localStorage fallback

## 📱 Multi-Device Compatibility

The application is fully responsive and tested across:

- **Mobile Devices**: Touch-optimized controls, bottom navigation
- **Tablets**: Hybrid interface with both mobile and desktop features
- **Desktop**: Full feature set with keyboard and mouse optimization

### Device-Specific Features

- **Mobile**:

  - Bottom tab navigation
  - Touch-based marker dragging
  - Camera integration for photo capture
  - Gesture-based map interactions

- **Desktop**:
  - Top navigation bar
  - Precise mouse-based marker positioning
  - Keyboard shortcuts
  - Multi-window support

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

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## 🚦 Usage

1. **Authentication**: Sign up/login to access features
2. **Location Permission**: Allow location access for precise mapping
3. **Tree Tagging**:
   - Click camera button or tap map location
   - Take photo or upload image
   - AI automatically identifies tree species
   - Fill additional details and save
4. **Map Interactions**:
   - View all tagged trees with category-colored markers
   - Drag markers to update locations
   - Click markers for detailed information
5. **Management**: View, edit, and organize your tree collection

## 🤝 Contributing

The codebase is modular and well-structured for easy contribution:

- Each component has a single responsibility
- Clear separation between UI, logic, and data layers
- TypeScript ensures type safety
- Comprehensive prop interfaces for component communication

## 📄 License

[Add your license information here]

---

**Built with ❤️ for sustainable forestry management**
