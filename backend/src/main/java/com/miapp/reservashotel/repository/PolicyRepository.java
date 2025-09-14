package com.miapp.reservashotel.repository;

import com.miapp.reservashotel.model.Policy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Repository for Policy entity.
 * Uses explicit JPQL to filter by the foreign key (product.id) while preserving the
 * existing method name so that services/controllers don't need changes.
 */
public interface PolicyRepository extends JpaRepository<Policy, Long> {

    /**
     * Finds policies belonging to a product by its id using the relationship.
     * Keeping the method name "findByProductId" to avoid refactors in services.
     */
    @Query("SELECT p FROM Policy p WHERE p.product.id = :productId")
    List<Policy> findByProductId(@Param("productId") Long productId);
}
