package com.miapp.reservashotel.controller;

import com.miapp.reservashotel.model.Product;
import com.miapp.reservashotel.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

/**
 * REST controller to manage product endpoints.
 */
@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*") // Allows requests from frontend
public class ProductController {

    @Autowired
    private ProductService productService;

    // Create a new product
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        return ResponseEntity.ok(productService.createProduct(product));
    }

    // List all products
    @GetMapping
    public ResponseEntity<List<Product>> listProducts() {
        return ResponseEntity.ok(productService.listProducts());
    }

    // Delete a product by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    // Update a product by ID
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        return ResponseEntity.ok(productService.updateProduct(id, product));
    }

    // Assign features to a product by product ID
    @PutMapping("/{productId}/features")
    public ResponseEntity<String> assignFeaturesToProduct(
            @PathVariable Long productId,
            @RequestBody Set<Long> featureIds) {

        productService.assignFeaturesToProduct(productId, featureIds);
        return ResponseEntity.ok("Features assigned successfully to product.");
    }

    // Get products by category ID
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable Long categoryId) {
        List<Product> products = productService.getProductsByCategoryId(categoryId);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/city/{city}")
    public ResponseEntity<List<Product>> getProductsByCity(@PathVariable String city) {
        return ResponseEntity.ok(productService.findProductsByCity(city));
    }


}
