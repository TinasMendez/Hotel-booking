package com.miapp.reservashotel.repository;

import com.miapp.reservashotel.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCityId(Long cityId);
    List<Product> findByFeatures_Id(Long featureId);
}



