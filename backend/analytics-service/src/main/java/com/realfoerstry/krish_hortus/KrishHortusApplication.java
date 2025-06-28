package com.realfoerstry.krish_hortus;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

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