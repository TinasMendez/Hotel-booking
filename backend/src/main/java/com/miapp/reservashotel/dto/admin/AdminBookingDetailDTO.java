package com.miapp.reservashotel.dto.admin;

/**
 * Detailed booking row for the Admin Dashboard latest bookings table.
 * All fields are strings/numbers to tolerate different entity field names and formats.
 * (No Lombok - manual getters/setters)
 */
public class AdminBookingDetailDTO {

    private Long id;

    private Long productId;
    private String productName;

    private Long customerId;
    private String customerEmail;
    private String customerName; // e.g., "Valentina Serna"

    private String checkIn;   // formatted as String (ISO or local date as available)
    private String checkOut;  // formatted as String
    private Integer nights;   // nullable, if we can infer it
    private String total;     // formatted amount as String if available

    public AdminBookingDetailDTO() {
    }

    // --- Getters / Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCheckIn() { return checkIn; }
    public void setCheckIn(String checkIn) { this.checkIn = checkIn; }

    public String getCheckOut() { return checkOut; }
    public void setCheckOut(String checkOut) { this.checkOut = checkOut; }

    public Integer getNights() { return nights; }
    public void setNights(Integer nights) { this.nights = nights; }

    public String getTotal() { return total; }
    public void setTotal(String total) { this.total = total; }
}

