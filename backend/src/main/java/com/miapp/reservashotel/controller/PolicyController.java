package com.miapp.reservashotel.controller;

import com.miapp.reservashotel.dto.PolicyRequestDTO;
import com.miapp.reservashotel.dto.PolicyResponseDTO;
import com.miapp.reservashotel.service.PolicyService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Policies controller
 * - Public GET by product
 * - Admin-only mutations are enforced by SecurityConfig
 */
@RestController
@RequestMapping("/api/policies")
public class PolicyController {

    private final PolicyService policyService;

    public PolicyController(PolicyService policyService) {
        this.policyService = policyService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PolicyResponseDTO> create(@Valid @RequestBody PolicyRequestDTO dto) {
        return ResponseEntity.ok(policyService.create(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PolicyResponseDTO> update(@PathVariable Long id, @Valid @RequestBody PolicyRequestDTO dto) {
        return ResponseEntity.ok(policyService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        policyService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PolicyResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(policyService.getById(id));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<PolicyResponseDTO>> getByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(policyService.getByProduct(productId));
    }
}

