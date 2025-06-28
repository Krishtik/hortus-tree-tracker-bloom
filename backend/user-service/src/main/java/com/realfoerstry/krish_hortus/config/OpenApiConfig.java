package com.realfoerstry.krish_hortus.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/*
 * OpenApiConfig
 * -------------
 * This file sets up automatic API documentation for the user-service using Swagger/OpenAPI.
 *
 * What does this file do?
 * - Makes it easy for developers (and non-developers) to see what endpoints are available
 * - Lets you try out the API in your browser (usually at /swagger-ui.html)
 *
 * This is very helpful for testing and for new team members.
 */

@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Krish Hortus User Service API")
                        .version("1.0.0")
                        .description("API documentation for the User Service of Krish Hortus platform."));
    }
} 