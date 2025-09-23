package com.miapp.reservashotel.service;

import com.miapp.reservashotel.dto.admin.AdminDashboardSummaryDTO;
import com.miapp.reservashotel.dto.admin.CategoryWithCountDTO;
import com.miapp.reservashotel.dto.admin.ProductListItemDTO;

import java.util.List;

/**
 * Aggregated operations for Admin Dashboard.
 */
public interface AdminDashboardService {
    AdminDashboardSummaryDTO getDashboardSummary();

    List<CategoryWithCountDTO> listCategoriesWithProductCount();

    List<ProductListItemDTO> listProductsByCategory(Long categoryId);
}
