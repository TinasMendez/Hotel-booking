package com.miapp.reservashotel.dto.bookings;

/** Simple availability flag for a given product and range. */
public class AvailabilityResponse {

    private boolean available;

    public AvailabilityResponse() {}
    public AvailabilityResponse(boolean available) { this.available = available; }

    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }
}
