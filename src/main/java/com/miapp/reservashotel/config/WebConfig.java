package com.miapp.reservashotel.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Global CORS configuration for local development and frontend integration.
 * - Allows requests from the local frontend origin.
 * - Exposes Authorization so the frontend can handle JWT flows.
 * - Methods and headers are whitelisted explicitly for clarity.
 *
 * NOTE: For production, restrict origins and methods according to your deployment.
 */
@Configuration
public class WebConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cfg = new CorsConfiguration();

        // Allow your local frontend origins (adjust if your dev port is different)
        cfg.setAllowedOrigins(List.of(
            "http://localhost:5173", // Vite default
            "http://localhost:3000"  // Common React port
        ));

        // Allowed HTTP methods commonly used by REST APIs
        cfg.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));

        // Allowed headers including Authorization for Bearer tokens
        cfg.setAllowedHeaders(List.of(
            "Authorization",
            "Content-Type",
            "X-Requested-With",
            "Accept",
            "Origin"
        ));

        // Expose Authorization header to the browser (useful for token handling)
        cfg.setExposedHeaders(List.of(
            "Authorization",
            "Content-Type"
        ));

        // Allow credentials only if you really need cookies/withCredentials
        cfg.setAllowCredentials(false);

        // Cache preflight responses to reduce OPTIONS chatter
        cfg.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Apply this configuration to all endpoints
        source.registerCorsConfiguration("/**", cfg);
        return source;
    }
}

