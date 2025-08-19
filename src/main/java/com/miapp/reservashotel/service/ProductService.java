package com.miapp.reservashotel.service;

import com.miapp.reservashotel.dto.ProductRequestDTO;
import com.miapp.reservashotel.dto.ProductResponseDTO;
import com.miapp.reservashotel.model.Product;

import java.util.List;

public interface ProductService {
    ProductResponseDTO createProduct(ProductRequestDTO productRequestDTO);
    List<ProductResponseDTO> getAllProducts();
    ProductResponseDTO getProductById(Long id);
    ProductResponseDTO updateProduct(Long id, ProductRequestDTO productRequestDTO);
    void deleteProduct(Long id);

    // Auxiliary method used by tests that may pass different DTO shapes
    Product createProduct(Object requestDto);
}

