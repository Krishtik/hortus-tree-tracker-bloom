
package com.krishhortus;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Main Spring Boot Application class for Krish Hortus API
 * 
 * This is the entry point for the Spring Boot application that serves
 * as the backend API for the Krish Hortus tree management system.
 * 
 * Features:
 * - RESTful API endpoints for tree management
 * - CORS configuration for frontend integration
 * - Database integration for tree data persistence
 * - Authentication and authorization
 * - File upload capabilities for tree images
 * 
 * @author Krish Hortus Development Team
 * @version 1.0.0
 */
@SpringBootApplication
@RestController
@CrossOrigin(origins = {"http://localhost:5173", "https://*.lovable.app"})
public class Application {

    /**
     * Main method to start the Spring Boot application
     * 
     * @param args Command line arguments passed to the application
     */
    public static void main(String[] args) {
        System.out.println("Starting Krish Hortus API Server...");
        SpringApplication.run(Application.class, args);
        System.out.println("Krish Hortus API Server started successfully!");
    }

    /**
     * Health check endpoint to verify API connectivity
     * 
     * This endpoint can be used by the frontend to check if the backend
     * is running and accessible. Returns a simple status message.
     * 
     * @return String indicating the API status
     */
    @GetMapping("/api/health")
    public String healthCheck() {
        return "Krish Hortus API is running successfully! 🌲";
    }

    /**
     * API information endpoint
     * 
     * Provides basic information about the API version and capabilities
     * 
     * @return String with API information
     */
    @GetMapping("/api/info")
    public String apiInfo() {
        return "Krish Hortus API v1.0.0 - Tree Management & Geospatial Mapping";
    }
}
