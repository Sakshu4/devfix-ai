package com.devfix.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

/**
 * CORS Configuration — allows the React frontend (port 5173) to call
 * the Spring Boot API (port 8082) without being blocked by the browser.
 *
 * Key fix: Spring Security was intercepting OPTIONS preflight requests
 * before this CORS filter could respond to them, causing 403 errors.
 * The SecurityConfig now explicitly permits OPTIONS requests.
 *
 * Without this: browser shows "Cross-Origin Request Blocked" on every API call.
 * With this:    React ↔ Spring Boot communication works freely — including
 *               requests that carry the Authorization: Bearer <token> header.
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // Allow React dev server (Vite default port)
        config.setAllowedOrigins(List.of("http://localhost:5173"));

        // Allow all HTTP methods including OPTIONS (preflight)
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

        // Explicitly allow the Authorization header (needed for JWT Bearer tokens)
        config.setAllowedHeaders(List.of(
                "Authorization",
                "Content-Type",
                "Accept",
                "Origin",
                "X-Requested-With"
        ));

        // Expose Authorization header so React can read it from responses
        config.setExposedHeaders(List.of("Authorization"));

        // Allow credentials (cookies + Authorization headers)
        config.setAllowCredentials(true);

        // Cache preflight response for 1 hour (reduces OPTIONS round-trips)
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}

