package com.miapp.reservashotel.service.impl;

import com.miapp.reservashotel.model.Role;
import com.miapp.reservashotel.model.User;
import com.miapp.reservashotel.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

/**
 * Custom UserDetailsService implementation.
 * Loads users by email (username parameter is treated as email).
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // NOTE: We do not declare "throws UsernameNotFoundException" because it's a RuntimeException (unchecked).
    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) {
        // Treat the provided username as email; support both finders for robustness.
        User user = userRepository.findByEmail(usernameOrEmail.toLowerCase())
                .or(() -> userRepository.findByUsername(usernameOrEmail))
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + usernameOrEmail));

        // Map roles to authorities
        Set<SimpleGrantedAuthority> authorities = user.getRoles()
                .stream()
                .map(Role::getName)
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toSet());

        // IMPORTANT: Domain User uses email as username for Spring Security
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail()) // username = email
                .password(user.getPassword())
                .authorities(authorities)
                .disabled(!user.isEnabled())
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .build();
    }
}





