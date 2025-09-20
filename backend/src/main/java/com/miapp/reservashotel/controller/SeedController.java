package com.miapp.reservashotel.controller;

import com.miapp.reservashotel.seed.DataSeeder;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/seed")
@PreAuthorize("hasRole('ADMIN')")
public class SeedController {

    private final DataSeeder seeder;

    public SeedController(DataSeeder seeder) {
        this.seeder = seeder;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> run() {
        // Execute the seeding routine (no-op by design right now)
        seeder.seed();

        // Return a small JSON payload so ResponseEntity has a body
        return ResponseEntity.ok(
                Map.of(
                        "status", "ok",
                        "message", "Seed executed"
                )
        );
    }
}

