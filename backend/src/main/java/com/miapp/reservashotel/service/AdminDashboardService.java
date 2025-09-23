package com.miapp.reservashotel.service;

import com.miapp.reservashotel.dto.admin.AdminBookingBucketsDTO;
import com.miapp.reservashotel.dto.admin.AdminBookingDetailDTO;
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

    /**
     * Latest bookings with rich info for dashboard table.
     */
    List<AdminBookingDetailDTO> getLatestBookingsDetailed(int limit);

    /**
     * Returns three buckets for dashboard tables.
     * @param limitPerBucket how many per bucket to return (1..50)
     * @param scanWindow     how many most-recent bookings to scan server-side (to categorize). Default 200 if null.
     */
    AdminBookingBucketsDTO getBookingBuckets(Integer limitPerBucket, Integer scanWindow);
}
