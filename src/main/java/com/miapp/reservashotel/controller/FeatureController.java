package com.miapp.reservashotel.controller;

import com.miapp.reservashotel.dto.FeatureRequestDTO;
import com.miapp.reservashotel.model.Feature;
import com.miapp.reservashotel.service.FeatureService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@Tag(name = "Feature", description = "Feature endpoints for managing hotel features")
@RestController
@RequestMapping("/api/features")
@RequiredArgsConstructor
public class FeatureController {

    private final FeatureService featureService;

    @Operation(summary = "Create a new feature", description = "Creates a new feature based on the provided data.")
    @PostMapping
    public ResponseEntity<Feature> createFeature(@Valid @RequestBody FeatureRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(featureService.createFromDTO(dto));
    }

    @Operation(summary = "Get all features", description = "Returns a list of all available features.")
    @GetMapping
    public ResponseEntity<List<Feature>> getAllFeatures() {
        return ResponseEntity.ok(featureService.listFeatures());
    }

    @Operation(summary = "Get a feature by ID", description = "Returns the feature that matches the provided ID.")
    @GetMapping("/{id}")
    public ResponseEntity<Feature> getFeatureById(@PathVariable Long id) {
        return ResponseEntity.ok(featureService.getFeatureById(id));
    }

    @Operation(summary = "Update a feature by ID", description = "Updates the feature with the given ID using the new data provided.")
    @PutMapping("/{id}")
    public ResponseEntity<Feature> updateFeature(@PathVariable Long id, @Valid @RequestBody FeatureRequestDTO dto) {
        return ResponseEntity.ok(featureService.updateFromDTO(id, dto));
    }

    @Operation(summary = "Delete a feature by ID", description = "Deletes the feature that matches the provided ID.")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFeature(@PathVariable Long id) {
        featureService.deleteFeature(id);
        return ResponseEntity.noContent().build();
    }
}
