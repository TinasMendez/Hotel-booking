package com.miapp.reservashotel.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Security configuration (no AuthenticationManager bean here).
 *
 * Key points:
 * - Enables CORS (uses WebConfig.corsConfigurationSource()).
 * - Disables CSRF for stateless REST API.
 * - Allows anonymous GET requests to /api/products/** for the public catalog.
 * - Allows Swagger/OpenAPI endpoints.
 * - Allows all OPTIONS requests (CORS preflight).
 * - All other requests require authentication.
 *
 * Notes:
 * - The AuthenticationManager and PasswordEncoder beans are declared in SecurityBeansConfig.
 * - This file intentionally does NOT declare an authenticationManager() bean to avoid
 *   bean name collisions.
 */
@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Use the CorsConfigurationSource bean defined in WebConfig
            .cors(cors -> {})
            // Stateless API
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // Authorization rules
            .authorizeHttpRequests(auth -> auth
                // Permit CORS preflight
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Public catalog (GET only). Admin operations remain protected.
                .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()

                // Swagger / OpenAPI docs
                .requestMatchers(
                    "/v3/api-docs/**",
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/docs.html",
                    "/openapi.yaml"
                ).permitAll()

                // Everything else requires authentication
                .anyRequest().authenticated()
            );

        return http.build();
    }
}









