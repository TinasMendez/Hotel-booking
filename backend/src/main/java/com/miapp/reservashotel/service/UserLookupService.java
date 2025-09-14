package com.miapp.reservashotel.service;

import com.miapp.reservashotel.model.User;
import com.miapp.reservashotel.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserLookupService {

    private final UserRepository users;

    public UserLookupService(UserRepository users) {
        this.users = users;
    }

    // Resolves the authenticated user by email/username
    public User currentUserOrThrow() {
        String username = SecurityUtils.getCurrentUsername();
        return users.findByEmail(username)
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found: " + username));
    }
}
