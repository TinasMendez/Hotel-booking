package com.miapp.reservashotel.controller;

import com.miapp.reservashotel.model.City;
import com.miapp.reservashotel.service.CityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cities")
@RequiredArgsConstructor
public class CityController {

    private final CityService cityService;

    @PostMapping
    public ResponseEntity<City> saveCity(@Valid @RequestBody City city) {
        return ResponseEntity.ok(cityService.saveCity(city));
    }

    @GetMapping("/{id}")
    public ResponseEntity<City> getCityById(@PathVariable Long id) {
        return ResponseEntity.ok(cityService.getCityById(id));
    }

    @GetMapping
    public ResponseEntity<List<City>> listCities() {
        return ResponseEntity.ok(cityService.listCities());
    }

    @PutMapping("/{id}")
    public ResponseEntity<City> updateCity(@PathVariable Long id, @Valid @RequestBody City city) {
        return ResponseEntity.ok(cityService.updateCity(id, city));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCity(@PathVariable Long id) {
        cityService.deleteCity(id);
        return ResponseEntity.noContent().build();
    }
}
