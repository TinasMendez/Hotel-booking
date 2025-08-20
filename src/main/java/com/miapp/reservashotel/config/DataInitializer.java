package com.miapp.reservashotel.config;

import com.miapp.reservashotel.model.Role;
import com.miapp.reservashotel.model.User;
import com.miapp.reservashotel.repository.RoleRepository;
import com.miapp.reservashotel.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Seeds base roles and an admin user on startup if they don't exist.
 * Safe to keep in production because it only creates missing data.
 */
@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner seedBaseData(RoleRepository roleRepository,
                                        UserRepository userRepository,
                                        PasswordEncoder passwordEncoder) {
        return args -> {
            // Ensure roles
            Role roleUser = roleRepository.findByName("ROLE_USER")
                    .orElseGet(() -> roleRepository.save(new Role("ROLE_USER")));
            Role roleAdmin = roleRepository.findByName("ROLE_ADMIN")
                    .orElseGet(() -> roleRepository.save(new Role("ROLE_ADMIN")));

            // Ensure an admin user for testing
            String adminEmail = "admin@admin.com";
            if (userRepository.findByEmail(adminEmail).isEmpty()) {
                User admin = new User();
                admin.setFirstName("Admin");
                admin.setLastName("User");
                admin.setEmail(adminEmail);
                admin.setPassword(passwordEncoder.encode("Admin123*")); // Change in production
                admin.setEnabled(true);
                admin.addRole(roleUser);
                admin.addRole(roleAdmin);
                userRepository.save(admin);
            }
        };
    }
}

