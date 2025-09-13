package com.miapp.reservashotel.service;

import com.miapp.reservashotel.dto.CategoryRequestDTO;
import com.miapp.reservashotel.dto.CategoryResponseDTO;

import java.util.List;

public interface CategoryService {
    CategoryResponseDTO createCategory(CategoryRequestDTO requestDTO);
    CategoryResponseDTO updateCategory(Long id, CategoryRequestDTO requestDTO);
    void deleteCategory(Long id);
    CategoryResponseDTO getCategoryById(Long id);
    List<CategoryResponseDTO> listCategories();
}




