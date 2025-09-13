package com.miapp.reservashotel.controller;

import com.miapp.reservashotel.dto.FeatureRequestDTO;
import com.miapp.reservashotel.model.Feature;
import com.miapp.reservashotel.service.FeatureService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Feature REST API.
 * No Lombok and no FeatureResponseDTO (service returns Feature entities).
 * DTOs live in com.miapp.reservashotel.dto.
 */
@RestController
@RequestMapping("/api/features")
public class FeatureController {

    private final FeatureService featureService;

    public FeatureController(FeatureService featureService) {
        this.featureService = featureService;
    }

    @GetMapping
    public ResponseEntity<List<Feature>> getAll() {
        return ResponseEntity.ok(featureService.listFeatures());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Feature> getById(@PathVariable Long id) {
        return ResponseEntity.ok(featureService.getFeatureById(id));
    }

    @PostMapping
    public ResponseEntity<Feature> create(@RequestBody @Valid FeatureRequestDTO dto) {
        Feature created = featureService.createFromDTO(dto);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Feature> update(@PathVariable Long id,
                                            @RequestBody @Valid FeatureRequestDTO dto) {
        Feature updated = featureService.updateFromDTO(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        featureService.deleteFeature(id);
        return ResponseEntity.noContent().build();
    }
}

