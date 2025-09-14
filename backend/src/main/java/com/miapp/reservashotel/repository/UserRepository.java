package com.miapp.reservashotel.repository;

import com.miapp.reservashotel.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

/**
 * Repository for User entity.
 * Login is by email. For backward-compatibility with old code that called
 * "findByUsername", we provide an alias that actually queries by email.
 */
public interface UserRepository extends JpaRepository<User, Long> {

    // Canonical lookup used by auth: case-insensitive email match
    @Query("SELECT u FROM User u WHERE LOWER(u.email) = LOWER(:email)")
    Optional<User> findByEmail(@Param("email") String email);

    boolean existsByEmail(String email);

    // Backward-compatible alias: treat "username" as email
    @Query("SELECT u FROM User u WHERE LOWER(u.email) = LOWER(:username)")
    Optional<User> findByUsername(@Param("username") String username);
}
