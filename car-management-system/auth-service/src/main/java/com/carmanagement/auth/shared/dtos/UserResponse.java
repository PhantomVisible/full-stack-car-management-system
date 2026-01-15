package com.carmanagement.auth.shared.dtos;

import java.time.LocalDateTime;

public class UserResponse {
    private Long userId;
    private String email;
    private String role;
    private boolean active;
    private LocalDateTime createdAt;

    // No-arg constructor for Jackson deserialization
    public UserResponse() {
    }

    // Constructor
    public UserResponse(Long userId, String email, String role,
            boolean active, LocalDateTime createdAt) {
        this.userId = userId;
        this.email = email;
        this.role = role;
        this.active = active;
        this.createdAt = createdAt;
    }

    // Getters
    public Long getUserId() {
        return userId;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public boolean isActive() {
        return active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    // Setters
    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}