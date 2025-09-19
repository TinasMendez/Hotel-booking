package com.miapp.reservashotel.seed;

import com.miapp.reservashotel.model.Booking;
import com.miapp.reservashotel.model.BookingStatus;
import com.miapp.reservashotel.model.Category;
import com.miapp.reservashotel.model.City;
import com.miapp.reservashotel.model.Feature;
import com.miapp.reservashotel.model.Policy;
import com.miapp.reservashotel.model.Product;
import com.miapp.reservashotel.model.ProductImage;
import com.miapp.reservashotel.model.Role;
import com.miapp.reservashotel.model.User;
import com.miapp.reservashotel.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

/**
 * Seeds a QA/demo dataset when app.seed.qa=true.
 */
@Component
@Order(150)
@ConditionalOnProperty(name = "app.seed.qa", havingValue = "true")
public class QaSampleDataLoader implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(QaSampleDataLoader.class);

    private final CityRepository cityRepository;
    private final CategoryRepository categoryRepository;
    private final FeatureRepository featureRepository;
    private final ProductRepository productRepository;
    private final PolicyRepository policyRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public QaSampleDataLoader(CityRepository cityRepository,
                              CategoryRepository categoryRepository,
                              FeatureRepository featureRepository,
                              ProductRepository productRepository,
                              PolicyRepository policyRepository,
                              BookingRepository bookingRepository,
                              UserRepository userRepository,
                              RoleRepository roleRepository,
                              PasswordEncoder passwordEncoder) {
        this.cityRepository = cityRepository;
        this.categoryRepository = categoryRepository;
        this.featureRepository = featureRepository;
        this.productRepository = productRepository;
        this.policyRepository = policyRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (productRepository.count() > 0) {
            log.info("Skipping QA seed: products already exist ({} records)", productRepository.count());
            return;
        }

        log.info("Seeding QA dataset…");

        User qaUser = ensureUser("qa.user@digitalbooking.local", "QaUser123*", "QA", "User");
        User qaGuest = ensureUser("guest.user@digitalbooking.local", "Guest123*", "Guest", "User");

        City cartagena = saveCity("Cartagena", "Colombia");
        City buenosAires = saveCity("Buenos Aires", "Argentina");
        City lima = saveCity("Lima", "Peru");

        Category beachfront = saveCategory("Beachfront", "Steps away from the sea", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e");
        Category urban = saveCategory("Urban Stay", "City experiences with premium amenities", "https://images.unsplash.com/photo-1460353581641-37baddab0fa2");
        Category boutique = saveCategory("Boutique", "Unique stays with personality", "https://images.unsplash.com/photo-1489515217757-5fd1be406fef");

        Feature wifi = ensureFeature("WiFi", "High-speed wireless internet", "wifi");
        Feature pool = ensureFeature("Pool", "Outdoor swimming pool", "pool");
        Feature breakfast = ensureFeature("Breakfast", "Complimentary breakfast included", "coffee");
        Feature parking = ensureFeature("Parking", "Private parking on-site", "car");
        Feature spa = ensureFeature("Spa", "Relaxing spa services", "spa");
        Feature gym = ensureFeature("Gym", "Fully equipped fitness center", "dumbbell");

        List<String> azulImages = List.of(
                "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a",
                "https://images.unsplash.com/photo-1501117716987-c8e1ecb2101f",
                "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
                "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
                "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba"
        );
        List<String> skylineImages = List.of(
                "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
                "https://images.unsplash.com/photo-1484154218962-a197022b5858",
                "https://images.unsplash.com/photo-1484154218962-a197022b5858",
                "https://images.unsplash.com/photo-1505691723518-36a5ac3be353",
                "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba"
        );
        List<String> colonialImages = List.of(
                "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
                "https://images.unsplash.com/photo-1464146072230-91cabc968266",
                "https://images.unsplash.com/photo-1464146072230-91cabc968266",
                "https://images.unsplash.com/photo-1505691723518-36a5ac3be353",
                "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a"
        );

        Product azulMarHotel = createProduct(
                "Azul Mar Hotel",
                "Beachfront suites with panoramic ocean views and private balconies.",
                new BigDecimal("320.00"),
                cartagena,
                beachfront,
                List.of(wifi, pool, breakfast, spa),
                azulImages
        );
        addPolicies(azulMarHotel,
                "House rules",
                List.of(
                        "Check-in from 3 PM. Check-out by 11 AM.",
                        "No pets allowed in premium suites."),
                "Health & safety",
                List.of(
                        "Daily sanitation of common areas.",
                        "Contactless room service available."),
                "Cancellation",
                List.of(
                        "Full refund up to 5 days before arrival.",
                        "50% refund if cancelled within 48 hours of arrival."));

        Product skylineLoft = createProduct(
                "Skyline Loft",
                "Modern loft in the heart of the city with skyline rooftop lounge.",
                new BigDecimal("210.00"),
                buenosAires,
                urban,
                List.of(wifi, gym, parking),
                skylineImages
        );
        addPolicies(skylineLoft,
                "House rules",
                List.of(
                        "Quiet hours from 10 PM to 8 AM.",
                        "Please respect the no-smoking policy."),
                "Health & safety",
                List.of(
                        "Smoke detectors installed in every room.",
                        "24/7 concierge available for assistance."),
                "Cancellation",
                List.of(
                        "Full refund within 24 hours of booking.",
                        "25% refund if cancelled up to 2 days before arrival."));

        Product colonialRetreat = createProduct(
                "Colonial Retreat",
                "Boutique colonial house with internal courtyard and artisan breakfast.",
                new BigDecimal("185.00"),
                lima,
                boutique,
                List.of(wifi, breakfast, spa),
                colonialImages
        );
        addPolicies(colonialRetreat,
                "House rules",
                List.of(
                        "Family friendly property.",
                        "Small pets allowed upon request."),
                "Health & safety",
                List.of(
                        "Daily housekeeping included.",
                        "All staff vaccinated."),
                "Cancellation",
                List.of(
                        "Non-refundable if cancelled within 72 hours of arrival."));

        seedBookings(qaUser, azulMarHotel, LocalDate.now().plusDays(7), LocalDate.now().plusDays(11));
        seedBookings(qaGuest, skylineLoft, LocalDate.now().plusDays(15), LocalDate.now().plusDays(18));

        log.info("QA dataset seeded: {} products, {} bookings", productRepository.count(), bookingRepository.count());
    }

    private User ensureUser(String email, String rawPassword, String firstName, String lastName) {
        return userRepository.findByEmail(email).orElseGet(() -> {
            Role userRole = roleRepository.findByName("ROLE_USER")
                    .orElseGet(() -> roleRepository.save(new Role("ROLE_USER")));
            User user = new User();
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(rawPassword));
            user.setEnabled(true);
            user.addRole(userRole);
            return userRepository.save(user);
        });
    }

    private City saveCity(String name, String country) {
        return cityRepository.save(new City(null, name, country));
    }

    private Category saveCategory(String name, String description, String imageUrl) {
        Category category = new Category();
        category.setName(name);
        category.setDescription(description);
        category.setImageUrl(imageUrl);
        return categoryRepository.save(category);
    }

    private Feature ensureFeature(String name, String description, String icon) {
        Feature existing = featureRepository.findByNameIgnoreCase(name);
        if (existing != null) return existing;
        Feature feature = new Feature();
        feature.setName(name);
        feature.setDescription(description);
        feature.setIcon(icon);
        return featureRepository.save(feature);
    }

    private Product createProduct(String name,
                                  String description,
                                  BigDecimal price,
                                  City city,
                                  Category category,
                                  List<Feature> features,
                                  List<String> imageUrls) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setCity(city);
        product.setCategory(category);
        product.setFeatures(new LinkedHashSet<>(features));

        List<ProductImage> images = new ArrayList<>();
        int order = 0;
        for (String url : imageUrls) {
            ProductImage image = new ProductImage();
            image.setProduct(product);
            image.setUrl(url);
            image.setSortOrder(order++);
            images.add(image);
        }
        product.setImages(images);
        if (!imageUrls.isEmpty()) {
            product.setImageUrl(imageUrls.get(0));
        }

        return productRepository.save(product);
    }

    private void addPolicies(Product product,
                             String rulesTitle,
                             List<String> rules,
                             String healthTitle,
                             List<String> health,
                             String cancellationTitle,
                             List<String> cancellation) {
        rules.forEach(text -> savePolicy(product, rulesTitle, text));
        health.forEach(text -> savePolicy(product, healthTitle, text));
        cancellation.forEach(text -> savePolicy(product, cancellationTitle, text));
    }

    private void savePolicy(Product product, String title, String description) {
        Policy policy = new Policy();
        policy.setProduct(product);
        policy.setTitle(title);
        policy.setDescription(description);
        policyRepository.save(policy);
    }

    private void seedBookings(User user, Product product, LocalDate start, LocalDate end) {
        Booking booking = new Booking();
        booking.setProductId(product.getId());
        booking.setCustomerId(user.getId());
        booking.setStartDate(start);
        booking.setEndDate(end);
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setCreatedAt(LocalDateTime.now().minusDays(1));
        bookingRepository.save(booking);
    }
}
