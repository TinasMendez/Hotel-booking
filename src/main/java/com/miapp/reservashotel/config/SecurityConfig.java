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
 * - Uses the CorsConfigurationSource bean declared in WebConfig (http.cors()).
 * - Disables CSRF for a stateless REST API with JWT.
 * - Permits anonymous access to:
 *   - POST auth endpoints (login/register).
 *   - GET catalog endpoints (products, categories).
 *   - GET availability endpoints (availability / blocked-dates) used by the calendar/search.
 *   - Swagger / OpenAPI docs.
 *   - All OPTIONS requests (CORS preflight).
 * - All other requests require authentication.
 *
 * Notes:
 * - AuthenticationManager and PasswordEncoder beans live in SecurityBeansConfig.
 * - If you have a JWT filter, add it in another config with addFilterBefore(...).
 */
@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Use the CorsConfigurationSource bean defined in WebConfig
            .cors(cors -> {})
            // Stateless API with JWT
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // Authorization rules
            .authorizeHttpRequests(auth -> auth
                // Permit CORS preflight
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // ---- Public auth endpoints (login/register) ----
                .requestMatchers(HttpMethod.POST,
                    "/api/auth/login", "/auth/login", "/login",
                    "/api/auth/register", "/auth/register", "/register"
                ).permitAll()

                // ---- Public catalog/search (GET) ----
                .requestMatchers(HttpMethod.GET,
                    // products (catalog + search/available variants)
                    "/api/products/**", "/products/**",
                    // categories (used by Home filter)
                    "/api/categories/**", "/categories/**",
                    // availability for calendar/search
                    "/api/bookings/availability", "/bookings/availability",
                    "/api/bookings/blocked-dates", "/bookings/blocked-dates"
                ).permitAll()

                // ---- Swagger / OpenAPI docs ----
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







