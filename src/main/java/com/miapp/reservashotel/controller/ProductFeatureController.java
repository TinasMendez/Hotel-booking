package com.miapp.reservashotel.controller;

import com.miapp.reservashotel.model.ProductFeature;
import com.miapp.reservashotel.service.ProductFeatureService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product-features")
@RequiredArgsConstructor
public class ProductFeatureController {

    private final ProductFeatureService service;

    @PostMapping
    public ResponseEntity<ProductFeature> save(@Valid @RequestBody ProductFeature pf) {
        return ResponseEntity.ok(service.save(pf));
    }

    @GetMapping
    public ResponseEntity<List<ProductFeature>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductFeature> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
