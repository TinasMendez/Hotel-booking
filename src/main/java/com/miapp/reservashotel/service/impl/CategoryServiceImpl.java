package com.miapp.reservashotel.service.impl;

import com.miapp.reservashotel.dto.CategoryRequestDTO;
import com.miapp.reservashotel.dto.CategoryResponseDTO;
import com.miapp.reservashotel.exception.ResourceNotFoundException;
import com.miapp.reservashotel.model.Category;
import com.miapp.reservashotel.repository.CategoryRepository;
import com.miapp.reservashotel.service.CategoryService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public CategoryResponseDTO createCategory(CategoryRequestDTO categoryRequestDTO) {
        Category category = new Category();
        category.setName(categoryRequestDTO.getName());
        category.setDescription(categoryRequestDTO.getDescription());
        category.setImageUrl(categoryRequestDTO.getImageUrl());
        category = categoryRepository.save(category);

        return new CategoryResponseDTO(category.getId(), category.getName(), category.getDescription(), category.getImageUrl());
    }

    @Override
    public CategoryResponseDTO getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        return new CategoryResponseDTO(category.getId(), category.getName(), category.getDescription(), category.getImageUrl());
    }

    @Override
    public List<CategoryResponseDTO> listCategories() {
        List<Category> categories = categoryRepository.findAll();
        List<CategoryResponseDTO> responseDTOList = new ArrayList<>();
        for (Category category : categories) {
            responseDTOList.add(new CategoryResponseDTO(
                    category.getId(),
                    category.getName(),
                    category.getDescription(),
                    category.getImageUrl()
            ));
        }
        return responseDTOList;
    }

    @Override
    public CategoryResponseDTO updateCategory(Long id, CategoryRequestDTO categoryRequestDTO) {
        Optional<Category> optionalCategory = categoryRepository.findById(id);
        if (optionalCategory.isPresent()) {
            Category category = optionalCategory.get();
            category.setName(categoryRequestDTO.getName());
            category.setDescription(categoryRequestDTO.getDescription());
            category.setImageUrl(categoryRequestDTO.getImageUrl());
            category = categoryRepository.save(category);

            return new CategoryResponseDTO(category.getId(), category.getName(), category.getDescription(), category.getImageUrl());
        } else {
            throw new ResourceNotFoundException("Category not found with id: " + id);
        }
    }

    @Override
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found with id: " + id);
        }
        categoryRepository.deleteById(id);
    }
}







