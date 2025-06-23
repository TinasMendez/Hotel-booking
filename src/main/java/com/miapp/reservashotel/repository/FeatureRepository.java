package com.miapp.reservashotel.repository;

import com.miapp.reservashotel.model.Feature;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Provides database operations for the Feature entity.
 */
@Repository
public interface FeatureRepository extends JpaRepository<Feature, Long> {
}
