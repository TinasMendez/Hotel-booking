package com.miapp.reservashotel.repository;

import com.miapp.reservashotel.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
