package com.miapp.reservashotel.service.impl;

import com.miapp.reservashotel.model.User;
import com.miapp.reservashotel.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

/**
 * CustomUserDetailsService that loads a user by USERNAME (not email),
 * because the current LoginRequest uses "username" and the AuthController authenticates with it.
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    // Manual constructor injection (no Lombok)
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        // Prefer username for now to align with LoginRequest and AuthController
        User user = userRepository.findByUsername(usernameOrEmail)
                .orElseGet(() -> userRepository.findByEmail(usernameOrEmail)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found: " + usernameOrEmail)));

        // If your User implements UserDetails, you could return it directly.
        // Returning Spring's User gives us a clean separation and avoids circular refs.
        Set<GrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName()))
                .collect(Collectors.toSet());

        return new org.springframework.security.core.userdetails.User(
                // subject stored in JWT (see JwtUtil) => username
                user.getUsername(),
                user.getPassword(),
                authorities
        );
    }
}



