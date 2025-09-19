package com.miapp.reservashotel.service;

import com.miapp.reservashotel.dto.ProductRequestDTO;
import com.miapp.reservashotel.dto.ProductResponseDTO;

import java.math.BigDecimal;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Product service contract using DTOs in com.miapp.reservashotel.dto.
 */
public interface ProductService {

    ProductResponseDTO createProduct(ProductRequestDTO request);

    ProductResponseDTO updateProduct(Long id, ProductRequestDTO request);

    void deleteProduct(Long id);

    ProductResponseDTO getProductById(Long id);

    Page<ProductResponseDTO> getAllProducts(Pageable pageable);

    /**
     * Search with optional filters: categoryId, cityId, featureId, price range and free-text query.
     * Any null filter is ignored.
     */
    Page<ProductResponseDTO> searchProducts(
            Long categoryId,
            Long cityId,
            Long featureId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String q,
            Pageable pageable
    );

    List<ProductResponseDTO> getRandomProducts(int limit);

}
