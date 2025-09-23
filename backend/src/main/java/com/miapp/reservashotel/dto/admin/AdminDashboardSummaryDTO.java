package com.miapp.reservashotel.dto.admin;

import java.util.List;

/**
 * DTO used by Admin Dashboard to show KPIs and short lists.
 * Manual getters/setters (no Lombok).
 */
public class AdminDashboardSummaryDTO {

    private long productsCount;
    private long categoriesCount;
    private long featuresCount;
    private long usersCount;
    private long adminsCount;

    private List<ProductMiniDTO> lastProducts;
    private List<BookingMiniDTO> lastBookings;

    public AdminDashboardSummaryDTO() {
    }

    public long getProductsCount() { return productsCount; }
    public void setProductsCount(long productsCount) { this.productsCount = productsCount; }

    public long getCategoriesCount() { return categoriesCount; }
    public void setCategoriesCount(long categoriesCount) { this.categoriesCount = categoriesCount; }

    public long getFeaturesCount() { return featuresCount; }
    public void setFeaturesCount(long featuresCount) { this.featuresCount = featuresCount; }

    public long getUsersCount() { return usersCount; }
    public void setUsersCount(long usersCount) { this.usersCount = usersCount; }

    public long getAdminsCount() { return adminsCount; }
    public void setAdminsCount(long adminsCount) { this.adminsCount = adminsCount; }

    public List<ProductMiniDTO> getLastProducts() { return lastProducts; }
    public void setLastProducts(List<ProductMiniDTO> lastProducts) { this.lastProducts = lastProducts; }

    public List<BookingMiniDTO> getLastBookings() { return lastBookings; }
    public void setLastBookings(List<BookingMiniDTO> lastBookings) { this.lastBookings = lastBookings; }

    // --- Nested mini DTOs ---
    public static class ProductMiniDTO {
        private Long id;
        private String name;

        public ProductMiniDTO() { }
        public ProductMiniDTO(Long id, String name) {
            this.id = id;
            this.name = name;
        }
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }

    public static class BookingMiniDTO {
        private Long id;
        private Long productId;   // Booking has productId (no relation)
        private Long customerId;  // Booking has customerId (no relation)

        public BookingMiniDTO() { }
        public BookingMiniDTO(Long id, Long productId, Long customerId) {
            this.id = id;
            this.productId = productId;
            this.customerId = customerId;
        }
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }
        public Long getCustomerId() { return customerId; }
        public void setCustomerId(Long customerId) { this.customerId = customerId; }
    }
}
