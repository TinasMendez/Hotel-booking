package com.miapp.reservashotel.repository;

import com.miapp.reservashotel.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface to handle CRUD operations for Category.
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
}

