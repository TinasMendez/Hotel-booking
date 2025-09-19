package com.miapp.reservashotel.service;

import com.miapp.reservashotel.dto.ProductRequestDTO;
import com.miapp.reservashotel.dto.ProductResponseDTO;

import java.math.BigDecimal;
import java.util.List;

/**
 * Product service contract using DTOs in com.miapp.reservashotel.dto.
 */
public interface ProductService {

    ProductResponseDTO createProduct(ProductRequestDTO request);

    ProductResponseDTO updateProduct(Long id, ProductRequestDTO request);

    void deleteProduct(Long id);

    ProductResponseDTO getProductById(Long id);

    List<ProductResponseDTO> getAllProducts();

    /**
     * Search with optional filters: categoryId, cityId, featureId, price range and free-text query.
     * Any null filter is ignored.
     */
    List<ProductResponseDTO> searchProducts(
            Long categoryId,
            Long cityId,
            Long featureId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String q
    );

    List<ProductResponseDTO> getRandomProducts(int limit);

}

