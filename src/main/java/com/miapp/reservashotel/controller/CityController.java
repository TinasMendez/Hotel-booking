package com.miapp.reservashotel.controller;

import com.miapp.reservashotel.model.City;
import com.miapp.reservashotel.service.CityService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller to manage city endpoints.
 */
@RestController
@RequestMapping("/api/cities")
@CrossOrigin(origins = "*")
public class CityController {

    @Autowired
    private CityService cityService;

    @PostMapping
    public ResponseEntity<City> createCity(@Valid @RequestBody City city) {
        return ResponseEntity.ok(cityService.createCity(city));
    }

    @GetMapping
    public ResponseEntity<List<City>> listCities() {
        return ResponseEntity.ok(cityService.listCities());
    }

    @GetMapping("/{id}")
    public ResponseEntity<City> getCityById(@PathVariable Long id) {
        return ResponseEntity.ok(cityService.getCityById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCity(@PathVariable Long id) {
        cityService.deleteCity(id);
        return ResponseEntity.noContent().build();
    }
}
