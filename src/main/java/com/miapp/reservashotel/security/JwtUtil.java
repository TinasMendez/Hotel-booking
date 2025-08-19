package com.miapp.reservashotel.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

/**
 * Utility class for generating and validating JWT tokens.
 * IMPORTANT:
 * - Secret and expiration are injected from application.properties / env (via Spring @Value).
 * - We do NOT keep the raw secret string as a field (avoids "unused field" warnings).
 * - For HS256 the key must be at least 256 bits (32 bytes). We validate that up front.
 */
@Component
public class JwtUtil {

    private final Key signingKey;     // final signing key derived from the secret
    private final long expirationMs;  // token expiration (in milliseconds)

    public JwtUtil(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration}") long expirationMs
    ) {
        if (secret == null || secret.trim().isEmpty()) {
            throw new IllegalArgumentException("JWT secret cannot be null/empty. Provide jwt.secret in properties or env.");
        }
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 32) {
            // HS256 requires at least 256 bits. Fail fast with a clear message.
            throw new IllegalArgumentException("JWT secret is too short. Use a value of at least 32 ASCII characters.");
        }
        this.signingKey = Keys.hmacShaKeyFor(keyBytes);
        this.expirationMs = expirationMs;
    }

    // ===== Public API =====

    public String extractUsername(String token) {
        // "sub" (subject) contains the username
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = parseAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String generateToken(UserDetails userDetails) {
        // Add custom claims if needed, e.g., roles
        return createToken(Map.of(), userDetails.getUsername());
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username != null
                && username.equals(userDetails.getUsername())
                && !isTokenExpired(token));
    }

    // ===== Internal helpers =====

    private String createToken(Map<String, Object> claims, String subject) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)                // subject = username
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + expirationMs))
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Claims parseAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}







