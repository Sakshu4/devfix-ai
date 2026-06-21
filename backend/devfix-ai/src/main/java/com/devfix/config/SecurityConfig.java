package com.devfix.config;

import com.devfix.security.JwtAuthFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * SecurityConfig — defines WHO can access WHAT.
 *
 * Design:
 *   PUBLIC  (no token needed):
 *     - POST /auth/register  → create account
 *     - POST /auth/login     → get token
 *     - GET  /technologies/** → browse knowledge base
 *     - GET  /errors/**       → search/read errors
 *
 *   PROTECTED (JWT required):
 *     - POST/PUT/DELETE /technologies → admin write ops
 *     - POST/PUT/DELETE /errors       → admin write ops
 *
 * This makes sense: DevFix AI is a read-only knowledge base for users,
 * but only authenticated admins can add/modify content.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Disable CSRF — not needed for stateless JWT APIs
            .csrf(csrf -> csrf.disable())

            // Delegate CORS to our CorsConfig bean (fixes preflight blocking)
            .cors(cors -> cors.configure(http))

            // Stateless — NO sessions, every request must carry the JWT
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // Authorization rules
            .authorizeHttpRequests(auth -> auth

                // OPTIONS preflight — always permit (required for CORS)
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Auth endpoints — always public
                .requestMatchers("/auth/**").permitAll()

                // READ operations — public (knowledge base is open)
                .requestMatchers(HttpMethod.GET, "/technologies/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/errors/**").permitAll()

                // WRITE operations — require JWT
                .requestMatchers(HttpMethod.POST,   "/technologies/**").authenticated()
                .requestMatchers(HttpMethod.PUT,    "/technologies/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/technologies/**").authenticated()
                .requestMatchers(HttpMethod.POST,   "/errors/**").authenticated()
                .requestMatchers(HttpMethod.PUT,    "/errors/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/errors/**").authenticated()

                // Everything else → must be authenticated
                .anyRequest().authenticated()
            )

            // Register JWT filter BEFORE Spring's built-in username/password filter
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // BCrypt password hasher — industry standard, very slow to crack
    // cost factor 10 means 2^10 = 1024 rounds of hashing
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
