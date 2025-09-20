package com.miapp.reservashotel.controller;

import com.miapp.reservashotel.model.ProductFeature;
import com.miapp.reservashotel.service.ProductFeatureService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST endpoints for ProductFeature links.
 * Uses void contract for assignment -> responds 204 No Content.
 */
@RestController
@RequestMapping("/api/product-features")
public class ProductFeatureController {

    private final ProductFeatureService productFeatureService;

    public ProductFeatureController(ProductFeatureService productFeatureService) {
        this.productFeatureService = productFeatureService;
    }

    @GetMapping
    public ResponseEntity<List<ProductFeature>> getAll() {
        return ResponseEntity.ok(productFeatureService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductFeature> getById(@PathVariable Long id) {
        return ResponseEntity.ok(productFeatureService.findById(id));
    }

    @PostMapping("/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> assign(@RequestParam Long productId,
                                        @RequestParam Long featureId) {
        // Service returns void; we return 204 as confirmation of success.
        productFeatureService.assignFeatureToProduct(productId, featureId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productFeatureService.deleteProductFeature(id);
        return ResponseEntity.noContent().build();
    }
}




