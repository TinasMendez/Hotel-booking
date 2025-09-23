package com.miapp.reservashotel.controller.admin;

import com.miapp.reservashotel.dto.admin.AdminDashboardSummaryDTO;
import com.miapp.reservashotel.dto.admin.CategoryWithCountDTO;
import com.miapp.reservashotel.dto.admin.ProductListItemDTO;
import com.miapp.reservashotel.service.AdminDashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Admin dashboard/controller for summary and category exploration.
 * Base path: /api/admin
 */
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminDashboardController {

    private final AdminDashboardService service;

    public AdminDashboardController(AdminDashboardService service) {
        this.service = service;
    }

    @GetMapping("/dashboard/summary")
    public ResponseEntity<AdminDashboardSummaryDTO> summary() {
        return ResponseEntity.ok(service.getDashboardSummary());
    }

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryWithCountDTO>> categoriesWithCount() {
        return ResponseEntity.ok(service.listCategoriesWithProductCount());
    }

    @GetMapping("/categories/{id}/products")
    public ResponseEntity<List<ProductListItemDTO>> productsByCategory(@PathVariable Long id) {
        return ResponseEntity.ok(service.listProductsByCategory(id));
    }
}
