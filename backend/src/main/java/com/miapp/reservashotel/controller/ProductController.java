package com.miapp.reservashotel.controller;

import com.miapp.reservashotel.dto.ProductRequestDTO;
import com.miapp.reservashotel.dto.ProductResponseDTO;
import com.miapp.reservashotel.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService service;
    public ProductController(ProductService service) { this.service = service; }

    @GetMapping
    public Page<ProductResponseDTO> list(@PageableDefault(size = 10) Pageable pageable) {
        return service.getAllProducts(pageable);
    }

    @GetMapping("/{id}")
    public ProductResponseDTO getOne(@PathVariable Long id) {
        return service.getProductById(id);
    }

    @GetMapping("/available")
    public Page<ProductResponseDTO> available(@PageableDefault(size = 10) Pageable pageable) {
        return service.getAllProducts(pageable);
    }

    @GetMapping("/search")
    public Page<ProductResponseDTO> search(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long cityId,
            @RequestParam(required = false) Long featureId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String q,
            @PageableDefault(size = 10) Pageable pageable
    ) {
        return service.searchProducts(
                categoryId, cityId, featureId, minPrice, maxPrice, q, pageable
        );
    }

    @GetMapping("/random")
    public ResponseEntity<List<ProductResponseDTO>> random(@RequestParam(defaultValue = "10") int limit) {
        int sanitized = Math.max(1, Math.min(limit, 10));
        return ResponseEntity.ok(service.getRandomProducts(sanitized));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductResponseDTO> create(@Valid @RequestBody ProductRequestDTO requestDTO) {
        ProductResponseDTO created = service.createProduct(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductResponseDTO> update(@PathVariable Long id,
                                                     @Valid @RequestBody ProductRequestDTO requestDTO) {
        ProductResponseDTO updated = service.updateProduct(id, requestDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
