package com.miapp.reservashotel.controller;

import com.miapp.reservashotel.dto.ProductRequestDTO;
import com.miapp.reservashotel.model.Product;
import com.miapp.reservashotel.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping("/products")
    public Product createProduct(@Valid @RequestBody ProductRequestDTO dto) {
        return productService.createProductFromDTO(dto);
    }

    @PutMapping("/products/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product updatedProduct) {
        return productService.updateProduct(id, updatedProduct);
    }

    @DeleteMapping("/products/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
    }

    @GetMapping("/products/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    @GetMapping("/products")
    public List<Product> listProducts() {
        return productService.listProducts();
    }

    // ---------- Advanced Endpoints Sprint 2 ----------

    // a) Productos disponibles
    @GetMapping("/products/available")
    public List<Product> getAvailableProducts() {
        return productService.findAvailableProducts();
    }

    // b) Productos por ciudad (case insensitive)
    @GetMapping("/products/city/{cityName}")
    public List<Product> getProductsByCity(@PathVariable String cityName) {
        return productService.findProductsByCity(cityName);
    }

    // c) Productos por rango de precio
    @GetMapping("/products/price")
    public List<Product> getProductsByPriceRange(
            @RequestParam BigDecimal min,
            @RequestParam BigDecimal max) {
        return productService.findProductsByPriceRange(min, max);
    }

    // d) Productos por categoría
    @GetMapping("/products/category/{categoryId}")
    public List<Product> getProductsByCategoryId(@PathVariable Long categoryId) {
        return productService.getProductsByCategoryId(categoryId);
    }

    // e) Productos por feature
    @GetMapping("/products/feature/{featureName}")
    public List<Product> getProductsByFeatureName(@PathVariable String featureName) {
        return productService.findProductsByFeatureName(featureName);
    }

    // f) Productos disponibles por ciudad
    @GetMapping("/products/available/city/{cityName}")
    public List<Product> getAvailableProductsByCity(@PathVariable String cityName) {
        return productService.findAvailableProductsByCity(cityName);
    }

    // g) Asignar features a un producto
    @PutMapping("/products/{productId}/features")
    public void assignFeaturesToProduct(
            @PathVariable Long productId,
            @RequestBody Set<Long> featureIds) {
        productService.assignFeaturesToProduct(productId, featureIds);
    }
}

