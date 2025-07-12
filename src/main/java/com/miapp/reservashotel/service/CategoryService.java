package com.miapp.reservashotel.service;

import com.miapp.reservashotel.dto.CategoryRequestDTO;
import com.miapp.reservashotel.model.Category;

import java.util.List;

public interface CategoryService {
    Category createCategory(CategoryRequestDTO dto);
    Category updateCategory(Long id, CategoryRequestDTO dto);
    void deleteCategory(Long id);
    Category getCategoryById(Long id);
    List<Category> listCategories();
}


