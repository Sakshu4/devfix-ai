package com.devfix.auth;

import com.devfix.entity.User;
import com.devfix.exception.ResourceNotFoundException;
import com.devfix.repository.UserRepository;
import com.devfix.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired private UserRepository  userRepository;
    @Autowired private JwtUtil         jwtUtil;
    @Autowired private PasswordEncoder passwordEncoder;

    // ── REGISTER ──────────────────────────────────────────────────────────────
    public AuthResponse register(RegisterRequest request) {

        // Check duplicates
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username '" + request.getUsername() + "' is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email '" + request.getEmail() + "' is already registered");
        }

        // Build and save the user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));  // BCrypt hash
        user.setRole("USER");
        userRepository.save(user);

        // Generate JWT and return
        String token = jwtUtil.generateToken(user.getUsername());
        return new AuthResponse(token, user.getUsername(), user.getRole(),
                                "Account created successfully!");
    }

    // ── LOGIN ─────────────────────────────────────────────────────────────────
    public AuthResponse login(AuthRequest request) {

        // Find user by username
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No account found with username '" + request.getUsername() + "'"));

        // Verify password (BCrypt compares hashed versions)
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Incorrect password");
        }

        // Generate JWT and return
        String token = jwtUtil.generateToken(user.getUsername());
        return new AuthResponse(token, user.getUsername(), user.getRole(),
                                "Login successful!");
    }
}
