package com.miapp.reservashotel.dto.auth;

import java.time.Instant;
import java.util.List;

/**
 * Login response returning the JWT and basic user profile.
 */
public class LoginResponse {

    private String token;
    private String tokenType; // usually "Bearer"
    private Instant expiresAt;

    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private List<String> roles;

    public LoginResponse() {
    }

    public LoginResponse(String token, String tokenType, Instant expiresAt,
                         Long userId, String firstName, String lastName, String email, List<String> roles) {
        this.token = token;
        this.tokenType = tokenType;
        this.expiresAt = expiresAt;
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.roles = roles;
    }

    // Getters and setters
    public String getToken() { return token; }

    public void setToken(String token) { this.token = token; }

    public String getTokenType() { return tokenType; }

    public void setTokenType(String tokenType) { this.tokenType = tokenType; }

    public Instant getExpiresAt() { return expiresAt; }

    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }

    public Long getUserId() { return userId; }

    public void setUserId(Long userId) { this.userId = userId; }

    public String getFirstName() { return firstName; }

    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }

    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email; }

    public List<String> getRoles() { return roles; }

    public void setRoles(List<String> roles) { this.roles = roles; }
}

