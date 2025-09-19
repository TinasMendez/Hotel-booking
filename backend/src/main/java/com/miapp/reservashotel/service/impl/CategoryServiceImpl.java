package com.miapp.reservashotel.service.impl;

import com.miapp.reservashotel.dto.CategoryRequestDTO;
import com.miapp.reservashotel.dto.CategoryResponseDTO;
import com.miapp.reservashotel.exception.ResourceConflictException;
import com.miapp.reservashotel.exception.ResourceNotFoundException;
import com.miapp.reservashotel.model.Category;
import com.miapp.reservashotel.repository.CategoryRepository;
import com.miapp.reservashotel.repository.ProductRepository;
import com.miapp.reservashotel.service.CategoryService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Category service without Lombok; DTO mapping included.
 */
@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    // Manual constructor injection
    public CategoryServiceImpl(CategoryRepository categoryRepository,
                               ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    @Override
    public CategoryResponseDTO createCategory(CategoryRequestDTO requestDTO) {
        Category c = new Category();
        c.setName(requestDTO.getName());
        c.setDescription(requestDTO.getDescription());
        c.setImageUrl(requestDTO.getImageUrl());
        Category saved = categoryRepository.save(c);
        return toDTO(saved);
    }

    @Override
    public CategoryResponseDTO updateCategory(Long id, CategoryRequestDTO requestDTO) {
        Category c = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        c.setName(requestDTO.getName());
        c.setDescription(requestDTO.getDescription());
        c.setImageUrl(requestDTO.getImageUrl());
        Category saved = categoryRepository.save(c);
        return toDTO(saved);
    }

    @Override
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found with id: " + id);
        }
        if (productRepository.existsByCategory_Id(id)) {
            throw new ResourceConflictException("Cannot delete category " + id + " because products are linked to it");
        }
        categoryRepository.deleteById(id);
    }

    @Override
    public CategoryResponseDTO getCategoryById(Long id) {
        Category c = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        return toDTO(c);
    }

    @Override
    public List<CategoryResponseDTO> listCategories() {
        return categoryRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    // ===== Mapping helper =====
    private CategoryResponseDTO toDTO(Category c) {
        CategoryResponseDTO dto = new CategoryResponseDTO();
        dto.setId(c.getId());
        dto.setName(c.getName());
        dto.setDescription(c.getDescription());
        dto.setImageUrl(c.getImageUrl());
        return dto;
    }
}







