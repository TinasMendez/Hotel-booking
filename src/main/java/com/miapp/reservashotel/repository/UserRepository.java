package com.miapp.reservashotel.repository;

import com.miapp.reservashotel.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Needed for Spring Security authentication
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
}


