package com.miapp.reservashotel.controller;

import com.miapp.reservashotel.dto.BookingRequestDTO;
import com.miapp.reservashotel.dto.BookingResponseDTO;
import com.miapp.reservashotel.model.BookingStatus;
import com.miapp.reservashotel.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping("/availability")
    public ResponseEntity<Boolean> availability(@RequestParam Long productId,
                                                @RequestParam LocalDate startDate,
                                                @RequestParam LocalDate endDate) {
        return ResponseEntity.ok(bookingService.isProductAvailable(productId, startDate, endDate));
    }

    @PostMapping
    public ResponseEntity<BookingResponseDTO> create(@RequestBody BookingRequestDTO request) {
        return ResponseEntity.ok(bookingService.createBooking(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponseDTO> one(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @GetMapping("/by-customer/{customerId}")
    public ResponseEntity<List<BookingResponseDTO>> byCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(bookingService.getBookingsByCustomerId(customerId));
    }

    @GetMapping("/by-status/{status}")
    public ResponseEntity<List<BookingResponseDTO>> byStatus(@PathVariable BookingStatus status) {
        return ResponseEntity.ok(bookingService.getBookingsByStatus(status));
    }

    @GetMapping("/between")
    public ResponseEntity<List<BookingResponseDTO>> between(@RequestParam LocalDate startDate,
                                                            @RequestParam LocalDate endDate) {
        return ResponseEntity.ok(bookingService.getBookingsBetweenDates(startDate, endDate));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookingResponseDTO> update(@PathVariable Long id,
                                                     @RequestBody BookingRequestDTO request) {
        return ResponseEntity.ok(bookingService.updateBooking(id, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<BookingResponseDTO> updateStatus(@PathVariable Long id,
                                                           @RequestParam BookingStatus status) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, status));
    }
}
