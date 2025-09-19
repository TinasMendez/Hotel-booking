package com.miapp.reservashotel.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

/**
 * Prevents the application from starting with a weak JWT secret in prod.
 */
@Component
@Profile("prod")
public class JwtSecretGuard {

    @Value("${jwt.secret:}")
    private String jwtSecret;

    @PostConstruct
    public void validate() {
        if (jwtSecret == null || jwtSecret.trim().length() < 48) {
            throw new IllegalStateException("JWT secret is too short. Provide a strong secret (>= 48 chars) via JWT_SECRET.");
        }
    }
}
