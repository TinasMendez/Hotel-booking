package com.miapp.reservashotel.repository;

import com.miapp.reservashotel.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.math.BigDecimal;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    boolean existsByName(String name);

    List<Product> findByCategoryId(Long categoryId);

    List<Product> findByCity_NameIgnoreCase(String cityName);

    List<Product> findByAvailableTrue();

    List<Product> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);

    List<Product> findByFeatures_NameIgnoreCase(String featureName);

    List<Product> findByAvailableTrueAndCity_NameIgnoreCase(String cityName);
}


