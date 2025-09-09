package com.miapp.reservashotel.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Global CORS configuration used by Spring Security (http.cors()).
 * Allows the React dev server (localhost:5173/5174) to call the API on port 8080.
 * This app uses Authorization header (Bearer) instead of cookies, so credentials are disabled.
 */
@Configuration
public class WebConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cfg = new CorsConfiguration();

        // Allowed origins for local development (add more if needed)
        cfg.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://localhost:5174"
        ));

        // Typical HTTP methods used by SPA frontends
        cfg.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));

        // Headers the client may send
        cfg.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept", "Origin"));

        // Headers the client may read from responses
        cfg.setExposedHeaders(List.of("Authorization", "Content-Type"));

        // We do not use cookies for auth (JWT in Authorization header)
        cfg.setAllowCredentials(false);

        // Cache preflight responses
        cfg.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);
        return source;
    }
}


