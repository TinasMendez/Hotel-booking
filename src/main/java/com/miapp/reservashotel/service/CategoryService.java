package com.miapp.reservashotel.service;

import com.miapp.reservashotel.model.Category;

import java.util.List;

public interface CategoryService {
    Category saveCategory(Category category);
    Category getCategoryById(Long id);
    List<Category> listCategories();
    Category updateCategory(Long id, Category updatedCategory);
    void deleteCategory(Long id);
}

