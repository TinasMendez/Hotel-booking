package com.miapp.reservashotel.controller;

import com.miapp.reservashotel.dto.auth.LoginRequest;
import com.miapp.reservashotel.dto.auth.LoginResponse;
import com.miapp.reservashotel.dto.auth.RegisterRequest;
import com.miapp.reservashotel.model.Role;
import com.miapp.reservashotel.model.User;
import com.miapp.reservashotel.repository.RoleRepository;
import com.miapp.reservashotel.repository.UserRepository;
import com.miapp.reservashotel.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException; // <-- IMPORT NECESARIO
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Authentication Controller for register and login endpoints.
 * - POST /api/auth/register
 * - POST /api/auth/login
 * - GET  /api/auth/me
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public AuthController(AuthenticationManager authenticationManager,
                          PasswordEncoder passwordEncoder,
                          JwtService jwtService,
                          UserRepository userRepository,
                          RoleRepository roleRepository) {
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        String email = request.getEmail().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.status(409).body(Map.of("message", "Email already registered"));
        }

        // Ensure ROLE_USER exists; if not, create it on the fly
        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseGet(() -> roleRepository.save(new Role("ROLE_USER")));

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEnabled(true);
        user.addRole(userRole);

        User saved = userRepository.save(user);

        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("roles", saved.getRoles().stream().map(Role::getName).collect(Collectors.toList()));
        extraClaims.put("uid", saved.getId());

        String token = jwtService.generateToken(saved.getEmail(), extraClaims);
        Instant expiresAt = Instant.ofEpochMilli(System.currentTimeMillis() + jwtService.getJwtExpirationMs());

        LoginResponse body = new LoginResponse(
                token,
                "Bearer",
                expiresAt,
                saved.getId(),
                saved.getFirstName(),
                saved.getLastName(),
                saved.getEmail(),
                saved.getRoles().stream().map(Role::getName).collect(Collectors.toList())
        );

        return ResponseEntity.created(URI.create("/api/auth/me")).body(body);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            String emailLower = request.getEmail().toLowerCase();
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(emailLower, request.getPassword())
            );

            org.springframework.security.core.userdetails.User principal =
                    (org.springframework.security.core.userdetails.User) auth.getPrincipal();

            User domainUser = userRepository.findByEmail(principal.getUsername())
                    .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

            Map<String, Object> extraClaims = new HashMap<>();
            extraClaims.put("roles", principal.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList());
            extraClaims.put("uid", domainUser.getId());

            String token = jwtService.generateToken(principal.getUsername(), extraClaims);
            Instant expiresAt = Instant.ofEpochMilli(System.currentTimeMillis() + jwtService.getJwtExpirationMs());

            LoginResponse body = new LoginResponse(
                    token,
                    "Bearer",
                    expiresAt,
                    domainUser.getId(),
                    domainUser.getFirstName(),
                    domainUser.getLastName(),
                    domainUser.getEmail(),
                    principal.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList())
            );

            return ResponseEntity.ok(body);
        } catch (DisabledException e) {
            return ResponseEntity.status(403).body(Map.of("message", "User disabled"));
        } catch (LockedException e) {
            return ResponseEntity.status(403).body(Map.of("message", "User locked"));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
        } catch (AuthenticationException e) { // <-- ahora compila
            return ResponseEntity.status(401).body(Map.of("message", "Authentication failed"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Unexpected error"));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }
        String email = authentication.getName();
        Optional<User> opt = userRepository.findByEmail(email);
        if (opt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "User not found"));
        }
        User u = opt.get();
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("id", u.getId());
        body.put("firstName", u.getFirstName());
        body.put("lastName", u.getLastName());
        body.put("email", u.getEmail());
        body.put("roles", u.getRoles().stream().map(Role::getName).toList());
        return ResponseEntity.ok(body);
    }
}
