package com.miapp.reservashotel.config;

import java.util.List;

import com.miapp.reservashotel.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.authorization.AuthorizationDecision;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final AuthenticationProvider authenticationProvider;
    private final boolean actuatorInfoPublic;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
                          AuthenticationProvider authenticationProvider,
                          @Value("${app.security.actuator.info-public:false}") boolean actuatorInfoPublic) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.authenticationProvider = authenticationProvider;
        this.actuatorInfoPublic = actuatorInfoPublic;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public auth endpoints
                .requestMatchers("/api/auth/**").permitAll()
                // Public GET resources used by home and product detail
                .requestMatchers(HttpMethod.GET,
                        "/api/products/**",
                        "/api/categories/**",
                        "/api/cities/**",
                        "/api/images/**",
                        "/api/features/**",
                        "/api/policies/product/**",
                        "/api/ratings/product/**",
                        "/api/bookings/availability",
                        "/api/bookings/product/**",
                        "/actuator/health/**"
                ).permitAll()
                // Optional Swagger endpoints
                .requestMatchers(
                        "/v3/api-docs/**",
                        "/swagger-ui/**",
                        "/swagger-ui.html"
                ).permitAll()
                .requestMatchers(HttpMethod.GET, "/actuator/info").access((authz, context) -> {
                    if (actuatorInfoPublic) {
                        return new AuthorizationDecision(true);
                    }
                    var authentication = authz.get();
                    boolean isAdmin = authentication != null && authentication.getAuthorities().stream()
                            .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
                    return new AuthorizationDecision(isAdmin);
                })
                // Everything else requires authentication
                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // CORS configuration for local Vite dev server
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET","POST","PUT","PATCH","DELETE","OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
