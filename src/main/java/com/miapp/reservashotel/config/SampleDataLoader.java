package com.miapp.reservashotel.config;

import com.miapp.reservashotel.model.Category;
import com.miapp.reservashotel.model.City;
import com.miapp.reservashotel.model.Feature;
import com.miapp.reservashotel.model.Product;
import com.miapp.reservashotel.repository.CategoryRepository;
import com.miapp.reservashotel.repository.CityRepository;
import com.miapp.reservashotel.repository.FeatureRepository;
import com.miapp.reservashotel.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.LinkedHashSet;
import java.util.Set;

/**
 * Seeds quick sample data for local dev only.
 * Runs when spring profile 'dev' is active.
 */
@Component
@Profile("dev")
public class SampleDataLoader implements CommandLineRunner {

    private final CityRepository cityRepository;
    private final CategoryRepository categoryRepository;
    private final FeatureRepository featureRepository;
    private final ProductRepository productRepository;

    public SampleDataLoader(CityRepository cityRepository,
                            CategoryRepository categoryRepository,
                            FeatureRepository featureRepository,
                            ProductRepository productRepository) {
        this.cityRepository = cityRepository;
        this.categoryRepository = categoryRepository;
        this.featureRepository = featureRepository;
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) {
        if (productRepository.count() > 0) {
            return;
        }

        City bogota = saveCity("Bogotá", "Colombia");
        City medellin = saveCity("Medellín", "Colombia");

        Category hotel = saveCategory("Hotel");
        Category hostel = saveCategory("Hostel");

        Feature wifi = saveFeature("WiFi");
        Feature pool = saveFeature("Pool");
        Feature breakfast = saveFeature("Breakfast");

        Product p1 = new Product();
        p1.setName("Hotel Centro Bogotá");
        p1.setDescription("Great location near museums.");
        p1.setImageUrl("https://pics.example/hotel1.jpg");
        p1.setPrice(new BigDecimal("120.00"));
        p1.setCity(bogota);
        p1.setCategory(hotel);
        p1.setFeatures(setOf(wifi, breakfast));
        productRepository.save(p1);

        Product p2 = new Product();
        p2.setName("Hostel El Poblado");
        p2.setDescription("Backpackers favorite in Medellín.");
        p2.setImageUrl("https://pics.example/hostel1.jpg");
        p2.setPrice(new BigDecimal("25.00"));
        p2.setCity(medellin);
        p2.setCategory(hostel);
        p2.setFeatures(setOf(wifi, pool));
        productRepository.save(p2);
    }

    private City saveCity(String name, String country) {
        City c = new City();
        c.setName(name);
        c.setCountry(country);
        return cityRepository.save(c);
    }

    private Category saveCategory(String name) {
        Category c = new Category();
        c.setName(name);
        return categoryRepository.save(c);
    }

    private Feature saveFeature(String name) {
        Feature f = new Feature();
        f.setName(name);
        return featureRepository.save(f);
    }

    @SafeVarargs
    private final <T> Set<T> setOf(T... elements) {
        Set<T> set = new LinkedHashSet<>();
        for (T e : elements) set.add(e);
        return set;
    }
}


