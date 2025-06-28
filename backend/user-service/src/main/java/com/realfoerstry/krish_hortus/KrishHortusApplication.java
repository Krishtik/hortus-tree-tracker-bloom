package com.realfoerstry.krish_hortus;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/*
 * Krish Hortus User-Service Main Application
 * -----------------------------------------
 * This file is the main entry point for the user-service microservice.
 *
 * What does this service do?
 * - It manages user profiles and user-related data for the Krish Hortus platform.
 * - It provides endpoints for getting/updating user profiles and changing passwords.
 * - It does NOT handle authentication (login/register) directly; that is done by the auth-service.
 *
 * The InfoController below provides simple endpoints to check if the service is running.
 * - /api/health returns a simple message if the service is up.
 * - /api/info returns a short description of the API.
 *
 * Anyone can use this file as a template for starting a new Spring Boot microservice.
 */
@SpringBootApplication
public class KrishHortusApplication {
    public static void main(String[] args) {
        System.out.println("Starting Krish Hortus API Server...");
        SpringApplication.run(KrishHortusApplication.class, args);
        System.out.println("Krish Hortus API Server started successfully!");
    }
}

// Health/info endpoints can be in a separate controller if you want:
@RestController
class InfoController {
    @GetMapping("/api/health")
    public String healthCheck() {
        return "Krish Hortus API is running successfully! 🌲";
    }

    @GetMapping("/api/info")
    public String apiInfo() {
        return "Krish Hortus API v1.0.0 - Tree Management & Geospatial Mapping";
    }
}