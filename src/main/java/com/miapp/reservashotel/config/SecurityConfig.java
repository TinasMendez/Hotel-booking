package com.miapp.reservashotel.config;

import com.miapp.reservashotel.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.context.annotation.Primary;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;

/**
 * Security configuration for JWT stateless API.
 * - Places our JwtAuthenticationFilter before UsernamePasswordAuthenticationFilter
 * - Exposes AuthenticationManager and PasswordEncoder beans
 * - Whitelists public GET endpoints, protects mutations, and secures admin paths
 */
@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable());
        http.sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.authorizeHttpRequests(auth -> auth
                // --- Public general ---
                .requestMatchers("/", "/error").permitAll()
                .requestMatchers("/v3/api-docs/**", "/swagger-ui.html", "/swagger-ui/**").permitAll()

                // --- Public auth (support both /auth and /api/auth just in case) ---
                .requestMatchers("/auth/**", "/api/auth/**").permitAll()

                // --- Public reads (GET) ---
                .requestMatchers(HttpMethod.GET,
                        "/api/products/**",
                        "/api/categories/**",
                        "/api/cities/**",
                        "/api/features/**",
                        "/api/policies/**",
                        "/api/reviews/product/**"
                ).permitAll()

                // --- WhatsApp click-through (if exposed as GET) ---
                .requestMatchers(HttpMethod.GET, "/api/whatsapp/**").permitAll()

                // --- Admin-only endpoints (mutations for catalog/policies) ---
                .requestMatchers(HttpMethod.POST, "/api/policies/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/policies/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/policies/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/categories/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/categories/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/categories/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/products/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/products/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/products/**").hasRole("ADMIN")

                // --- Authenticated user actions ---
                .requestMatchers("/api/favorites/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/reviews/**").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/reviews/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/reviews/**").authenticated()

                // --- Everything else ---
                .anyRequest().authenticated()
        );

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
@Primary
@ConditionalOnMissingBean(AuthenticationManager.class)
public AuthenticationManager authenticationManager(AuthenticationConfiguration cfg) throws Exception {
    // Return the global AuthenticationManager configured by Spring Security
    return cfg.getAuthenticationManager();
}

    @Bean
    public PasswordEncoder passwordEncoder() {
        // Use BCrypt with default strength 10
        return new BCryptPasswordEncoder();
    }
}

