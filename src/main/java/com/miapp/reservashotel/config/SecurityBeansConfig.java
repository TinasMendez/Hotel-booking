package com.miapp.reservashotel.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Security infrastructure beans.
 *
 * Provides:
 *  - PasswordEncoder bean (BCrypt) used to hash and verify passwords.
 *  - AuthenticationManager bean obtained from Spring's AuthenticationConfiguration.
 *
 * Notes:
 *  - Do not use Lombok. Beans are declared manually.
 *  - This class does not replace your SecurityFilterChain; it complements it.
 *  - AuthenticationManager returned here uses the configured UserDetailsService
 *    and PasswordEncoder to authenticate username/password logins.
 */
@Configuration
public class SecurityBeansConfig {

    /**
     * BCryptPasswordEncoder with a sensible default strength.
     * This encoder is referenced anywhere a PasswordEncoder is required
     * (e.g., during user registration and login checks).
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Exposes the AuthenticationManager so it can be injected in controllers/services.
     * Spring Boot builds it from your security configuration (UserDetailsService, etc.).
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
}
