
package com.krishhortus.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.HashMap;
import java.util.Map;

/**
 * Authentication Controller for Krish Hortus API
 * 
 * Handles user authentication operations including:
 * - User registration (signup)
 * - User login
 * - Token refresh
 * - User profile management
 * - Logout functionality
 * 
 * This controller provides the authentication endpoints that the React frontend
 * will communicate with for user management operations.
 * 
 * @author Krish Hortus Development Team
 * @version 1.0.0
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "https://*.lovable.app"})
public class AuthController {

    /**
     * User registration endpoint
     * 
     * Handles new user account creation with email, password, and name.
     * Returns user data and authentication tokens upon successful registration.
     * 
     * @param requestBody Map containing user registration data (email, password, name)
     * @return ResponseEntity with user data and authentication tokens
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, String> requestBody) {
        System.out.println("Registration attempt for email: " + requestBody.get("email"));
        
        // Extract user data from request
        String email = requestBody.get("email");
        String password = requestBody.get("password");
        String name = requestBody.get("name");
        
        // Create response with user data and tokens
        Map<String, Object> response = new HashMap<>();
        Map<String, Object> user = new HashMap<>();
        
        // Generate mock user data (replace with actual user creation logic)
        user.put("id", java.util.UUID.randomUUID().toString());
        user.put("email", email);
        user.put("name", name);
        user.put("role", "USER");
        user.put("isVerified", true);
        user.put("createdAt", java.time.Instant.now().toString());
        
        // Generate mock tokens (replace with actual JWT token generation)
        String token = "mock-jwt-token-" + System.currentTimeMillis();
        String refreshToken = "mock-refresh-token-" + System.currentTimeMillis();
        
        // Build response object
        response.put("success", true);
        response.put("message", "User registered successfully");
        response.put("data", Map.of(
            "user", user,
            "token", token,
            "refreshToken", refreshToken,
            "expiresIn", 86400 // 24 hours
        ));
        
        System.out.println("User registered successfully: " + email);
        return ResponseEntity.ok(response);
    }

    /**
     * User login endpoint
     * 
     * Authenticates existing users with email and password.
     * Returns user data and fresh authentication tokens upon successful login.
     * 
     * @param requestBody Map containing login credentials (email, password)
     * @return ResponseEntity with user data and authentication tokens
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> requestBody) {
        System.out.println("Login attempt for email: " + requestBody.get("email"));
        
        // Extract login credentials
        String email = requestBody.get("email");
        String password = requestBody.get("password");
        
        // Create response with user data and tokens
        Map<String, Object> response = new HashMap<>();
        Map<String, Object> user = new HashMap<>();
        
        // Generate mock user data (replace with actual user authentication logic)
        user.put("id", java.util.UUID.randomUUID().toString());
        user.put("email", email);
        user.put("name", email.split("@")[0]); // Use email prefix as name
        user.put("role", "USER");
        user.put("isVerified", true);
        user.put("createdAt", java.time.Instant.now().minusSeconds(86400).toString()); // Yesterday
        
        // Generate mock tokens (replace with actual JWT token generation)
        String token = "mock-jwt-token-" + System.currentTimeMillis();
        String refreshToken = "mock-refresh-token-" + System.currentTimeMillis();
        
        // Build response object
        response.put("success", true);
        response.put("message", "Login successful");
        response.put("data", Map.of(
            "user", user,
            "token", token,
            "refreshToken", refreshToken,
            "expiresIn", 86400 // 24 hours
        ));
        
        System.out.println("User logged in successfully: " + email);
        return ResponseEntity.ok(response);
    }

    /**
     * Token refresh endpoint
     * 
     * Refreshes authentication tokens using a valid refresh token.
     * Extends user session without requiring re-authentication.
     * 
     * @param requestBody Map containing refresh token
     * @return ResponseEntity with new authentication tokens
     */
    @PostMapping("/refresh")
    public ResponseEntity<Map<String, Object>> refresh(@RequestBody Map<String, String> requestBody) {
        System.out.println("Token refresh requested");
        
        String refreshToken = requestBody.get("refreshToken");
        
        // Create response with new tokens
        Map<String, Object> response = new HashMap<>();
        Map<String, Object> user = new HashMap<>();
        
        // Generate mock user data (replace with actual token validation and user lookup)
        user.put("id", java.util.UUID.randomUUID().toString());
        user.put("email", "user@example.com");
        user.put("name", "Demo User");
        user.put("role", "USER");
        user.put("isVerified", true);
        user.put("createdAt", java.time.Instant.now().minusSeconds(86400).toString());
        
        // Generate new mock tokens
        String newToken = "mock-jwt-token-" + System.currentTimeMillis();
        String newRefreshToken = "mock-refresh-token-" + System.currentTimeMillis();
        
        // Build response object
        response.put("success", true);
        response.put("message", "Token refreshed successfully");
        response.put("data", Map.of(
            "user", user,
            "token", newToken,
            "refreshToken", newRefreshToken,
            "expiresIn", 86400 // 24 hours
        ));
        
        System.out.println("Token refreshed successfully");
        return ResponseEntity.ok(response);
    }

    /**
     * User profile endpoint
     * 
     * Retrieves current user profile information based on authentication token.
     * Requires valid authentication header.
     * 
     * @param authHeader Authorization header containing JWT token
     * @return ResponseEntity with user profile data
     */
    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getProfile(@RequestHeader("Authorization") String authHeader) {
        System.out.println("Profile request with token: " + authHeader);
        
        // Create response with user profile data
        Map<String, Object> response = new HashMap<>();
        Map<String, Object> user = new HashMap<>();
        
        // Generate mock user profile (replace with actual user lookup from token)
        user.put("id", java.util.UUID.randomUUID().toString());
        user.put("email", "user@example.com");
        user.put("name", "Demo User");
        user.put("role", "USER");
        user.put("isVerified", true);
        user.put("createdAt", java.time.Instant.now().minusSeconds(86400).toString());
        user.put("profilePicture", null);
        
        // Build response object
        response.put("success", true);
        response.put("message", "Profile retrieved successfully");
        response.put("data", user);
        
        System.out.println("Profile retrieved successfully");
        return ResponseEntity.ok(response);
    }

    /**
     * User logout endpoint
     * 
     * Handles user logout by invalidating tokens (server-side logout).
     * Client should also clear tokens from local storage.
     * 
     * @return ResponseEntity confirming successful logout
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout() {
        System.out.println("User logout requested");
        
        // Create logout response
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Logout successful");
        response.put("data", "");
        
        System.out.println("User logged out successfully");
        return ResponseEntity.ok(response);
    }
}
