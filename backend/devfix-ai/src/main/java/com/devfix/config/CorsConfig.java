package com.devfix.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

/**
 * CORS Configuration — allows the React frontend (port 5173) to call
 * the Spring Boot API (port 8082) without being blocked by the browser.
 *
 * Without this: browser shows "Cross-Origin Request Blocked" on every API call.
 * With this:    React ↔ Spring Boot communication works freely.
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // Allow React dev server (Vite default port)
        config.addAllowedOrigin("http://localhost:5173");

        // Allow all standard HTTP methods
        config.addAllowedMethod("GET");
        config.addAllowedMethod("POST");
        config.addAllowedMethod("PUT");
        config.addAllowedMethod("DELETE");
        config.addAllowedMethod("OPTIONS");

        // Allow all headers (Content-Type, Authorization, etc.)
        config.addAllowedHeader("*");

        // Allow credentials (needed later for JWT auth)
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);  // apply to ALL endpoints

        return new CorsFilter(source);
    }
}
