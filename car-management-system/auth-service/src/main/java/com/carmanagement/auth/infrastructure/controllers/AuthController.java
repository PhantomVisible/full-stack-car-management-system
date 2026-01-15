package com.carmanagement.auth.infrastructure.controllers;

import com.carmanagement.auth.application.services.AuthService;
import com.carmanagement.auth.application.services.UserService;
import com.carmanagement.auth.domain.models.Role;
import com.carmanagement.auth.domain.models.User;
import com.carmanagement.auth.infrastructure.security.JwtUtil;
import com.carmanagement.auth.shared.dtos.AuthResponse;
import com.carmanagement.auth.shared.dtos.RegisterRequest;
import com.carmanagement.auth.shared.dtos.UserResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthService authService, UserService userService, JwtUtil jwtUtil) {
        this.authService = authService;
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        User user = authService.registerUser(
                request.getEmail(),
                request.getPassword(),
                request.getRole());

        AuthResponse response = new AuthResponse(
                user.getEmail(),
                user.getRole().name(),
                "User registered successfully");

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody RegisterRequest request) {

        String token = authService.authenticateAndGenerateToken(request.getEmail(), request.getPassword());
        User user = authService.loginUser(request.getEmail(), request.getPassword());

        AuthResponse response = new AuthResponse(
                request.getEmail(),
                user.getRole().name(),
                "Login successful");
        response.setToken(token);
        // We'll add JWT token in the next step

        return ResponseEntity.ok(response);
    }

    @GetMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.id")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long userId) {
        User user = userService.getUserById(userId);
        return ResponseEntity.ok(toUserResponse(user));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(
            @RequestHeader("Authorization") String authHeader) {

        // Extract email from token
        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);

        User user = userService.getUserByEmail(email);
        return ResponseEntity.ok(toUserResponse(user));
    }

    // Helper method to convert User to UserResponse
    private UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getUserId(),
                user.getEmail(),
                user.getRole().name(),
                user.isActive(),
                user.getCreatedAt());
    }
}