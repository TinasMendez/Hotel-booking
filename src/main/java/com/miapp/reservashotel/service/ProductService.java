package com.miapp.reservashotel.service;

import com.miapp.reservashotel.dto.ProductRequestDTO;
import com.miapp.reservashotel.model.Product;

import java.util.List;
import java.util.Set;

public interface ProductService {
    Product createProductFromDTO(ProductRequestDTO dto);
    Product updateProduct(Long id, Product updatedProduct);
    void deleteProduct(Long id);
    Product getProductById(Long id);
    Product createProduct(Product product);
    List<Product> listProducts();
    void assignFeaturesToProduct(Long productId, Set<Long> featureIds);
    List<Product> getProductsByCategoryId(Long categoryId);
    List<Product> findProductsByCity(String cityName);
}

