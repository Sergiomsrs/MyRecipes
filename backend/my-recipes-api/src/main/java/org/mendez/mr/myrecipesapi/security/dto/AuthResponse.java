package org.mendez.mr.myrecipesapi.security.dto;

import java.util.UUID;

public class AuthResponse {

    private String token;
    private String role;
    private UUID userId;

    public AuthResponse(String token, String role, UUID userId) {
        this.token = token;
        this.role = role;
        this.userId = userId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }
}
