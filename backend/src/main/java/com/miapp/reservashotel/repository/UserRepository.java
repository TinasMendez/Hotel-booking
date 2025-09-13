package com.miapp.reservashotel.repository;

import com.miapp.reservashotel.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

/**
 * Repository for User entity.
 * We support login by email. For backward-compatibility with prior code that tried "findByUsername",
 * we map it to email via a custom JPQL query.
 */
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    // Backward-compatible alias: treat "username" as email.
    @Query("SELECT u FROM User u WHERE LOWER(u.email) = LOWER(:username)")
    Optional<User> findByUsername(@Param("username") String username);
}


