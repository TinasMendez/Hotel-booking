package com.miapp.reservashotel.repository;

import com.miapp.reservashotel.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositorio JPA para acceder a productos desde la base de datos, para la entidad Product.
 */

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    boolean existsByNombre(String nombre);
}

