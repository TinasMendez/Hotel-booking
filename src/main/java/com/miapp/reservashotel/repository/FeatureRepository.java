package com.miapp.reservashotel.repository;

import com.miapp.reservashotel.model.Feature;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeatureRepository extends JpaRepository<Feature, Long> {
    Feature findByNameIgnoreCase(String name);
}

