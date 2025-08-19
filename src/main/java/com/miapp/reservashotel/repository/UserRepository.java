package com.miapp.reservashotel.repository;

import com.miapp.reservashotel.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    /**
     * Alias that delegates to email-based lookup to avoid deriving a query
     * for a non-existent 'username' attribute.
     */
    default Optional<User> findByUsername(String username) {
        return findByEmail(username);
    }
}

