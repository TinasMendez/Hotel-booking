package com.miapp.reservashotel.config;

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
                // Admin routes and panel tools
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                // Admin-only mutations for catalog entities
                .requestMatchers(HttpMethod.POST,
                        "/api/categories/**",
                        "/api/features/**",
                        "/api/cities/**",
                        "/api/products/**",
                        "/api/policies/**",
                        "/api/product-features/**"
                ).hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT,
                        "/api/categories/**",
                        "/api/features/**",
                        "/api/cities/**",
                        "/api/products/**",
                        "/api/policies/**",
                        "/api/product-features/**"
                ).hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE,
                        "/api/categories/**",
                        "/api/features/**",
                        "/api/cities/**",
                        "/api/products/**",
                        "/api/policies/**",
                        "/api/product-features/**"
                ).hasRole("ADMIN")
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

}
