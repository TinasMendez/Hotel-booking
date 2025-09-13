package com.miapp.reservashotel.dto.bookings;

import java.util.List;

/** List of blocked ISO dates for a product calendar. */
public class BlockedDatesResponse {
    private List<String> dates;

    public BlockedDatesResponse() {}
    public BlockedDatesResponse(List<String> dates) { this.dates = dates; }

    public List<String> getDates() { return dates; }
    public void setDates(List<String> dates) { this.dates = dates; }
}
