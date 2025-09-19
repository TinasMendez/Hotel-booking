package com.miapp.reservashotel;

import com.miapp.reservashotel.exception.ResourceConflictException;
import com.miapp.reservashotel.exception.ResourceNotFoundException;
import com.miapp.reservashotel.repository.CategoryRepository;
import com.miapp.reservashotel.repository.ProductRepository;
import com.miapp.reservashotel.service.impl.CategoryServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InOrder;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CategoryServiceImplTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private ProductRepository productRepository;

    private CategoryServiceImpl categoryService;

    @BeforeEach
    void setUp() {
        categoryService = new CategoryServiceImpl(categoryRepository, productRepository);
    }

    @Test
    void deleteCategory_whenNotFound_throwsResourceNotFoundException() {
        long missingId = 42L;
        when(categoryRepository.existsById(missingId)).thenReturn(false);

        assertThatThrownBy(() -> categoryService.deleteCategory(missingId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Category not found");

        verify(categoryRepository).existsById(missingId);
        verifyNoMoreInteractions(categoryRepository, productRepository);
    }

    @Test
    void deleteCategory_whenProductsExist_throwsConflict() {
        long categoryId = 7L;
        when(categoryRepository.existsById(categoryId)).thenReturn(true);
        when(productRepository.existsByCategory_Id(categoryId)).thenReturn(true);

        assertThatThrownBy(() -> categoryService.deleteCategory(categoryId))
                .isInstanceOf(ResourceConflictException.class)
                .hasMessageContaining("Cannot delete category");

        InOrder inOrder = inOrder(categoryRepository, productRepository);
        inOrder.verify(categoryRepository).existsById(categoryId);
        inOrder.verify(productRepository).existsByCategory_Id(categoryId);
        verify(categoryRepository, never()).deleteById(anyLong());
    }

    @Test
    void deleteCategory_whenNoDependencies_deletesSuccessfully() {
        long categoryId = 5L;
        when(categoryRepository.existsById(categoryId)).thenReturn(true);
        when(productRepository.existsByCategory_Id(categoryId)).thenReturn(false);

        categoryService.deleteCategory(categoryId);

        InOrder inOrder = inOrder(categoryRepository, productRepository);
        inOrder.verify(categoryRepository).existsById(categoryId);
        inOrder.verify(productRepository).existsByCategory_Id(categoryId);
        inOrder.verify(categoryRepository).deleteById(categoryId);
        verifyNoMoreInteractions(categoryRepository, productRepository);
    }
}
