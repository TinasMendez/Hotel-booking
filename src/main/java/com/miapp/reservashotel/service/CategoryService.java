package com.miapp.reservashotel.service;

import com.miapp.reservashotel.dto.CategoryRequestDTO;
import com.miapp.reservashotel.model.Category;

import java.util.List;

public interface CategoryService {
    Category createFromDTO(CategoryRequestDTO dto);
    Category updateFromDTO(Long id, CategoryRequestDTO dto);
    Category getCategoryById(Long id);
    List<Category> listCategories();
    void deleteCategory(Long id);
}

