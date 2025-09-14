package com.miapp.reservashotel.service.impl;

import com.miapp.reservashotel.model.Role;
import com.miapp.reservashotel.model.User;
import com.miapp.reservashotel.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Spring Security calls this with whatever the login form sent.
     * In our app we log in with email. If some old caller passes "username",
     * we still try to resolve it as email using the alias method.
     */
    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        Optional<User> opt =
                userRepository.findByEmail(usernameOrEmail)
                        .or(() -> userRepository.findByUsername(usernameOrEmail)); // alias -> email

        User user = opt.orElseThrow(() ->
                new UsernameNotFoundException("User not found: " + usernameOrEmail));

        Collection<GrantedAuthority> authorities = user.getRoles()
                .stream()
                .map(Role::getName) // e.g. "ROLE_ADMIN", "ROLE_USER"
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

        // We authenticate by email; Spring only necesita username (mostramos email)
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                authorities
        );
    }
}
