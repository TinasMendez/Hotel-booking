package com.miapp.reservashotel.repository;

import com.miapp.reservashotel.model.Policy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PolicyRepository extends JpaRepository<Policy, Long> {
    List<Policy> findByProductId(Long productId);
}

