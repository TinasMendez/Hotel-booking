package com.miapp.reservashotel.controller;

import com.miapp.reservashotel.dto.CityRequestDTO;
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
@CrossOrigin(origins = "*")
public class CityController {

    private final CityService cityService;

    @PostMapping
    public ResponseEntity<City> create(@Valid @RequestBody CityRequestDTO dto) {
        return ResponseEntity.ok(cityService.createFromDTO(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<City> update(@PathVariable Long id, @Valid @RequestBody CityRequestDTO dto) {
        return ResponseEntity.ok(cityService.updateFromDTO(id, dto));
    }

    @GetMapping
    public ResponseEntity<List<City>> listAll() {
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
