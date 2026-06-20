package com.devfix.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

/**
 * JwtUtil — the JWT engine.
 *
 * Responsibilities:
 *   1. Generate a JWT token (when user logs in)
 *   2. Extract username from a token (on each request)
 *   3. Validate a token (check signature + expiry)
 *
 * How JWT works:
 *   Header.Payload.Signature
 *   Header:    algorithm (HS256)
 *   Payload:   username, issued-at, expiry
 *   Signature: HMAC-SHA256(header + payload, SECRET_KEY)
 *
 *   The server keeps SECRET_KEY private.
 *   Anyone can decode header/payload (not secret),
 *   but cannot forge the signature without the key.
 */
@Component
public class JwtUtil {

    // 256-bit secret key — in production this goes in application.properties / environment variable
    // NEVER hardcode in production. This is fine for development.
    private static final String SECRET = "devfix-ai-super-secret-key-2024-must-be-256-bits-long!";
    private static final long   EXPIRY_MS = 1000L * 60 * 60 * 24;  // 24 hours

    private final SecretKey key = Keys.hmacShaKeyFor(SECRET.getBytes());

    // ── Generate token ────────────────────────────────────────────────────────
    public String generateToken(String username) {
        return Jwts.builder()
                .subject(username)                           // "sub" claim
                .issuedAt(new Date())                        // "iat" claim
                .expiration(new Date(System.currentTimeMillis() + EXPIRY_MS))  // "exp"
                .signWith(key)                               // HMAC-SHA256
                .compact();                                  // builds the token string
    }

    // ── Extract username (subject) from token ─────────────────────────────────
    public String extractUsername(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    // ── Validate token (signature + expiry) ───────────────────────────────────
    public boolean isTokenValid(String token) {
        try {
            Jwts.parser().verifyWith(key).build().parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;  // expired, tampered, or malformed
        }
    }
}
