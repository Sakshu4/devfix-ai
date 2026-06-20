package com.devfix.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * JwtAuthFilter — intercepts EVERY HTTP request exactly once.
 *
 * What it does:
 *   1. Reads the Authorization header: "Bearer <token>"
 *   2. Extracts and validates the JWT token
 *   3. If valid → sets the authenticated user in SecurityContext
 *   4. If missing/invalid → does nothing (Spring Security handles the 401)
 *
 * Flow:
 *   Request → JwtAuthFilter → SecurityConfig rules → Controller
 */
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // Step 1: Read Authorization header
        String authHeader = request.getHeader("Authorization");

        // Step 2: Check format — must start with "Bearer "
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);  // no token → skip
            return;
        }

        // Step 3: Extract the token (remove "Bearer " prefix)
        String token = authHeader.substring(7);

        // Step 4: Validate token
        if (!jwtUtil.isTokenValid(token)) {
            filterChain.doFilter(request, response);  // invalid → skip
            return;
        }

        // Step 5: Extract username and set authentication in SecurityContext
        String username = jwtUtil.extractUsername(token);

        // Only set if not already authenticated
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                            username,
                            null,
                            List.of(new SimpleGrantedAuthority("ROLE_USER"))
                    );
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }

        // Step 6: Continue to next filter/controller
        filterChain.doFilter(request, response);
    }
}
