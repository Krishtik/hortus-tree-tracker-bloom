
package com.realfoerstry.krish_hortus.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Tree Management Controller for Krish Hortus API
 * 
 * Handles all tree-related operations including:
 * - Tree creation and registration
 * - Tree information retrieval
 * - Tree data updates
 * - Tree deletion
 * - Geospatial queries for nearby trees
 * - Tree verification and moderation
 * 
 * This controller integrates with H3 geospatial indexing for efficient
 * location-based queries and supports various tree categories.
 * 
 * @author Krish Hortus Development Team
 * @version 1.0.0
 */
@RestController
@RequestMapping("/api/trees")
@CrossOrigin(origins = {"http://localhost:5173", "https://*.lovable.app"})
public class TreeController {

    /**
     * Retrieve all trees with optional filtering
     * 
     * Supports filtering by category, species, location, and verification status.
     * Implements pagination for efficient data handling.
     * 
     * @param category Optional tree category filter (FARM, COMMUNITY, NURSERY, etc.)
     * @param species Optional species name filter
     * @param lat Optional latitude for location-based filtering
     * @param lng Optional longitude for location-based filtering
     * @param radius Optional radius in meters for location-based filtering
     * @param h3Index Optional H3 index for geospatial filtering
     * @param verified Optional verification status filter
     * @param page Page number for pagination (default: 0)
     * @param size Page size for pagination (default: 20)
     * @return ResponseEntity with paginated tree data
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllTrees(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String species,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng,
            @RequestParam(required = false) Double radius,
            @RequestParam(required = false) String h3Index,
            @RequestParam(required = false) Boolean verified,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        System.out.println("Fetching trees with filters - Category: " + category + ", Species: " + species);
        
        // Create mock tree data (replace with actual database queries)
        List<Map<String, Object>> trees = createMockTrees();
        
        // Apply filters if provided
        if (category != null) {
            trees = trees.stream()
                .filter(tree -> category.equals(tree.get("category")))
                .collect(java.util.stream.Collectors.toList());
        }
        
        // Create paginated response
        Map<String, Object> response = new HashMap<>();
        Map<String, Object> data = new HashMap<>();
        
        data.put("trees", trees);
        data.put("totalElements", trees.size());
        data.put("totalPages", (trees.size() + size - 1) / size);
        data.put("currentPage", page);
        data.put("pageSize", size);
        
        response.put("success", true);
        response.put("message", "Trees retrieved successfully");
        response.put("data", data);
        
        System.out.println("Retrieved " + trees.size() + " trees");
        return ResponseEntity.ok(response);
    }

    /**
     * Create a new tree record
     * 
     * Registers a new tree in the system with location data, measurements,
     * and metadata. Automatically generates H3 index for geospatial queries.
     * 
     * @param requestBody Map containing tree data (name, location, category, etc.)
     * @return ResponseEntity with created tree data
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createTree(@RequestBody Map<String, Object> requestBody) {
        System.out.println("Creating new tree: " + requestBody.get("name"));
        
        // Extract tree data from request
        String name = (String) requestBody.get("name");
        String category = (String) requestBody.get("category");
        Map<String, Object> location = (Map<String, Object>) requestBody.get("location");
        
        // Create new tree object
        Map<String, Object> tree = new HashMap<>();
        tree.put("id", java.util.UUID.randomUUID().toString());
        tree.put("name", name);
        tree.put("category", category);
        tree.put("location", location);
        tree.put("scientificName", requestBody.get("scientificName"));
        tree.put("localName", requestBody.get("localName"));
        tree.put("measurements", requestBody.get("measurements"));
        tree.put("taggedBy", "current-user-id"); // Replace with actual user ID from token
        tree.put("taggedAt", java.time.Instant.now().toString());
        tree.put("isAIGenerated", false);
        tree.put("isVerified", false);
        tree.put("createdAt", java.time.Instant.now().toString());
        tree.put("updatedAt", java.time.Instant.now().toString());
        
        // Generate H3 index for location (mock implementation)
        if (location != null) {
            double lat = ((Number) location.get("lat")).doubleValue();
            double lng = ((Number) location.get("lng")).doubleValue();
            String h3Index = generateMockH3Index(lat, lng);
            ((Map<String, Object>) tree.get("location")).put("h3Index", h3Index);
        }
        
        // Create response
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Tree created successfully");
        response.put("data", tree);
        
        System.out.println("Tree created successfully with ID: " + tree.get("id"));
        return ResponseEntity.ok(response);
    }

    /**
     * Retrieve a specific tree by ID
     * 
     * Returns detailed information about a single tree including
     * location data, measurements, photos, and verification status.
     * 
     * @param id Unique tree identifier
     * @return ResponseEntity with tree data or 404 if not found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getTreeById(@PathVariable String id) {
        System.out.println("Fetching tree with ID: " + id);
        
        // Create mock tree data (replace with actual database lookup)
        Map<String, Object> tree = createMockTree(id);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Tree retrieved successfully");
        response.put("data", tree);
        
        System.out.println("Tree retrieved: " + tree.get("name"));
        return ResponseEntity.ok(response);
    }

    /**
     * Update an existing tree record
     * 
     * Allows modification of tree data including location, measurements,
     * and metadata. Updates the modification timestamp automatically.
     * 
     * @param id Unique tree identifier
     * @param requestBody Map containing updated tree data
     * @return ResponseEntity with updated tree data
     */
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateTree(@PathVariable String id, @RequestBody Map<String, Object> requestBody) {
        System.out.println("Updating tree with ID: " + id);
        
        // Get existing tree (mock implementation)
        Map<String, Object> tree = createMockTree(id);
        
        // Update tree fields
        if (requestBody.containsKey("name")) {
            tree.put("name", requestBody.get("name"));
        }
        if (requestBody.containsKey("location")) {
            tree.put("location", requestBody.get("location"));
            
            // Regenerate H3 index if location changed
            Map<String, Object> location = (Map<String, Object>) requestBody.get("location");
            if (location.containsKey("lat") && location.containsKey("lng")) {
                double lat = ((Number) location.get("lat")).doubleValue();
                double lng = ((Number) location.get("lng")).doubleValue();
                String h3Index = generateMockH3Index(lat, lng);
                location.put("h3Index", h3Index);
            }
        }
        if (requestBody.containsKey("measurements")) {
            tree.put("measurements", requestBody.get("measurements"));
        }
        
        // Update timestamp
        tree.put("updatedAt", java.time.Instant.now().toString());
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Tree updated successfully");
        response.put("data", tree);
        
        System.out.println("Tree updated successfully: " + tree.get("name"));
        return ResponseEntity.ok(response);
    }

    /**
     * Delete a tree record
     * 
     * Removes a tree from the system. This action should be restricted
     * to tree owners and administrators.
     * 
     * @param id Unique tree identifier
     * @return ResponseEntity confirming deletion
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteTree(@PathVariable String id) {
        System.out.println("Deleting tree with ID: " + id);
        
        // Delete tree from database (mock implementation)
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Tree deleted successfully");
        response.put("data", "");
        
        System.out.println("Tree deleted successfully");
        return ResponseEntity.ok(response);
    }

    /**
     * Find nearby trees based on location and radius
     * 
     * Uses geospatial queries to find trees within a specified radius
     * of a given location. Optimized with H3 indexing for performance.
     * 
     * @param lat Latitude of search center
     * @param lng Longitude of search center
     * @param radius Search radius in meters
     * @param limit Maximum number of results to return
     * @return ResponseEntity with nearby trees data
     */
    @GetMapping("/nearby")
    public ResponseEntity<Map<String, Object>> getNearbyTrees(
            @RequestParam Double lat,
            @RequestParam Double lng,
            @RequestParam Double radius,
            @RequestParam(defaultValue = "50") Integer limit) {
        
        System.out.println("Finding nearby trees - Lat: " + lat + ", Lng: " + lng + ", Radius: " + radius + "m");
        
        // Create mock nearby trees (replace with actual geospatial query)
        List<Map<String, Object>> nearbyTrees = createMockTrees().subList(0, Math.min(limit, 5));
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Nearby trees retrieved successfully");
        response.put("data", nearbyTrees);
        
        System.out.println("Found " + nearbyTrees.size() + " nearby trees");
        return ResponseEntity.ok(response);
    }

    /**
     * Verify a tree record
     * 
     * Marks a tree as verified by an administrator or expert.
     * Updates verification status and timestamp.
     * 
     * @param id Unique tree identifier
     * @return ResponseEntity with updated tree data
     */
    @PostMapping("/{id}/verify")
    public ResponseEntity<Map<String, Object>> verifyTree(@PathVariable String id) {
        System.out.println("Verifying tree with ID: " + id);
        
        // Get and update tree (mock implementation)
        Map<String, Object> tree = createMockTree(id);
        tree.put("isVerified", true);
        tree.put("verifiedBy", "current-admin-id"); // Replace with actual admin ID
        tree.put("verifiedAt", java.time.Instant.now().toString());
        tree.put("updatedAt", java.time.Instant.now().toString());
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Tree verified successfully");
        response.put("data", tree);
        
        System.out.println("Tree verified successfully");
        return ResponseEntity.ok(response);
    }

    /**
     * Helper method to create mock tree data for development
     * 
     * @return List of mock tree objects
     */
    private List<Map<String, Object>> createMockTrees() {
        List<Map<String, Object>> trees = new ArrayList<>();
        
        // Create sample trees with different categories
        trees.add(createMockTree("1", "Oak Tree", "FARM", 19.7515, 75.7139));
        trees.add(createMockTree("2", "Banyan Tree", "COMMUNITY", 19.7520, 75.7145));
        trees.add(createMockTree("3", "Mango Tree", "NURSERY", 19.7510, 75.7135));
        trees.add(createMockTree("4", "Neem Tree", "FARM", 19.7525, 75.7150));
        trees.add(createMockTree("5", "Peepal Tree", "COMMUNITY", 19.7505, 75.7130));
        
        return trees;
    }

    /**
     * Helper method to create a single mock tree
     * 
     * @param id Tree identifier
     * @return Mock tree object
     */
    private Map<String, Object> createMockTree(String id) {
        return createMockTree(id, "Sample Tree", "FARM", 19.7515, 75.7139);
    }

    /**
     * Helper method to create a mock tree with specific parameters
     * 
     * @param id Tree identifier
     * @param name Tree name
     * @param category Tree category
     * @param lat Latitude
     * @param lng Longitude
     * @return Mock tree object
     */
    private Map<String, Object> createMockTree(String id, String name, String category, double lat, double lng) {
        Map<String, Object> tree = new HashMap<>();
        Map<String, Object> location = new HashMap<>();
        Map<String, Object> measurements = new HashMap<>();
        
        // Basic tree information
        tree.put("id", id);
        tree.put("name", name);
        tree.put("scientificName", "Quercus species");
        tree.put("localName", "Local " + name);
        tree.put("category", category);
        
        // Location data with H3 index
        location.put("lat", lat);
        location.put("lng", lng);
        location.put("h3Index", generateMockH3Index(lat, lng));
        location.put("address", "Sample Address, Maharashtra, India");
        tree.put("location", location);
        
        // Measurements
        measurements.put("height", 15.5);
        measurements.put("trunkWidth", 2.3);
        measurements.put("canopySpread", 8.7);
        tree.put("measurements", measurements);
        
        // Metadata
        tree.put("taggedBy", "user-123");
        tree.put("taggedAt", java.time.Instant.now().minusSeconds(3600).toString());
        tree.put("isAIGenerated", false);
        tree.put("isVerified", Math.random() > 0.5); // Random verification status
        tree.put("createdAt", java.time.Instant.now().minusSeconds(7200).toString());
        tree.put("updatedAt", java.time.Instant.now().minusSeconds(1800).toString());
        tree.put("photos", new ArrayList<>());
        
        return tree;
    }

    /**
     * Helper method to generate a mock H3 index
     * 
     * @param lat Latitude
     * @param lng Longitude
     * @return Mock H3 index string
     */
    private String generateMockH3Index(double lat, double lng) {
        // This is a mock implementation. In production, use actual H3 library
        return "8f3969a9ab83240";
    }
}
