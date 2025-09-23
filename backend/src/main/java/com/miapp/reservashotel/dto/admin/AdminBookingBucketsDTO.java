package com.miapp.reservashotel.dto.admin;

import java.util.List;

/**
 * Buckets for dashboard: Active / Previous / Cancelled bookings.
 * Manual getters/setters (no Lombok).
 */
public class AdminBookingBucketsDTO {

    private List<AdminBookingDetailDTO> active;
    private List<AdminBookingDetailDTO> previous;
    private List<AdminBookingDetailDTO> cancelled;

    public AdminBookingBucketsDTO() { }

    public AdminBookingBucketsDTO(List<AdminBookingDetailDTO> active,
                                  List<AdminBookingDetailDTO> previous,
                                  List<AdminBookingDetailDTO> cancelled) {
        this.active = active;
        this.previous = previous;
        this.cancelled = cancelled;
    }

    public List<AdminBookingDetailDTO> getActive() { return active; }
    public void setActive(List<AdminBookingDetailDTO> active) { this.active = active; }

    public List<AdminBookingDetailDTO> getPrevious() { return previous; }
    public void setPrevious(List<AdminBookingDetailDTO> previous) { this.previous = previous; }

    public List<AdminBookingDetailDTO> getCancelled() { return cancelled; }
    public void setCancelled(List<AdminBookingDetailDTO> cancelled) { this.cancelled = cancelled; }
}
