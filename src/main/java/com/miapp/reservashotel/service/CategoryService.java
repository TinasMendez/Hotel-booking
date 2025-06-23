package com.miapp.reservashotel.service;

import com.miapp.reservashotel.model.Category;

import java.util.List;

/**
 * Defines the business logic for categories.
 */
public interface CategoryService {
    Category createCategory(Category category);
    List<Category> listCategories();
    Category updateCategory(Long id, Category updatedCategory);
    void deleteCategory(Long id);
    Category getCategoryById(Long id);
}

