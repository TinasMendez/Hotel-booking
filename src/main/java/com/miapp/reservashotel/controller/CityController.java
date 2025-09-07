package com.miapp.reservashotel.controller;

import com.miapp.reservashotel.dto.CityRequestDTO;
import com.miapp.reservashotel.model.City;
import com.miapp.reservashotel.service.CityService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * City REST API.
 * No Lombok: explicit constructor injection and no Lombok annotations.
 */
@RestController
@RequestMapping("/api/cities")
public class CityController {

    private final CityService cityService;

    public CityController(CityService cityService) {
        this.cityService = cityService;
    }

    @PostMapping
    public ResponseEntity<City> create(@RequestBody @Valid CityRequestDTO dto) {
        City created = cityService.createFromDTO(dto);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<City> update(@PathVariable Long id, @RequestBody @Valid CityRequestDTO dto) {
        City updated = cityService.updateFromDTO(id, dto);
        return ResponseEntity.ok(updated);
    }

    @GetMapping
    public ResponseEntity<List<City>> list() {
        return ResponseEntity.ok(cityService.listCities());
    }

    @GetMapping("/{id}")
    public ResponseEntity<City> getById(@PathVariable Long id) {
        return ResponseEntity.ok(cityService.getCityById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        cityService.deleteCity(id);
        return ResponseEntity.noContent().build();
    }
}

