package com.miapp.reservashotel.seed;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * No-op seeder that keeps a public seed() method for SeedController compatibility.
 * If you already load demo/sample data elsewhere (e.g., SampleDataLoader/DataInitializer),
 * this class intentionally does nothing on startup and exposes a no-op seed() to compile.
 */
@Component
@Order(50)
public class DataSeeder implements CommandLineRunner {

    /**
     * Kept for compatibility with SeedController. Intentionally does nothing.
     * Add real seeding here in the future if you want to seed via HTTP.
     */
    public void seed() {
        // No-op by design
    }

    /**
     * Startup hook. Intentionally does nothing to avoid duplicate data.
     */
    @Override
    public void run(String... args) {
        // No-op by design
    }
}
