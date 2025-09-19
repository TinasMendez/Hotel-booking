package com.miapp.reservashotel.repository;

import com.miapp.reservashotel.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Product entity.
 * Uses explicit JPQL to filter by related entity ids (city.id, feature.id) while
 * keeping current method signatures to avoid changes elsewhere.
 */
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    /**
     * Finds products by city id using the relationship field 'city'.
     * The method name keeps "findByCityId" for backward compatibility.
     */
    @Query("SELECT p FROM Product p WHERE p.city.id = :cityId")
    List<Product> findByCityId(@Param("cityId") Long cityId);

    /**
     * Finds products by a feature id present in the many-to-many 'features' set.
     * The existing derived method 'findByFeatures_Id' also works, but we provide
     * an explicit JPQL alternative to keep signatures stable if needed.
     *
     * NOTE: You currently have 'findByFeatures_Id(Long featureId)'. If you prefer JPQL:
     *   @Query(\"SELECT DISTINCT p FROM Product p JOIN p.features f WHERE f.id = :featureId\")
     *   List<Product> findByFeatureId(@Param(\"featureId\") Long featureId);
     *
     * For now, we keep your original method untouched to avoid ripple effects.
     */
    List<Product> findByFeatures_Id(Long featureId);

    Optional<Product> findByNameIgnoreCase(String name);

    boolean existsByCategory_Id(Long categoryId);

    @Query("SELECT p.id FROM Product p")
    List<Long> findAllIds();
}
