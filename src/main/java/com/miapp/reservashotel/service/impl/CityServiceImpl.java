package com.miapp.reservashotel.service.impl;

import com.miapp.reservashotel.dto.CityRequestDTO;
import com.miapp.reservashotel.exception.ResourceNotFoundException;
import com.miapp.reservashotel.model.City;
import com.miapp.reservashotel.repository.CityRepository;
import com.miapp.reservashotel.service.CityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CityServiceImpl implements CityService {

    private final CityRepository cityRepository;

    @Override
    public City createFromDTO(CityRequestDTO dto) {
        City city = new City();
        city.setName(dto.getName());
        city.setCountry(dto.getCountry());
        return cityRepository.save(city);
    }

    @Override
    public City updateFromDTO(Long id, CityRequestDTO dto) {
        City existing = cityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("City not found with id: " + id));
        existing.setName(dto.getName());
        existing.setCountry(dto.getCountry());
        return cityRepository.save(existing);
    }

    @Override
    public City getCityById(Long id) {
        return cityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("City not found with id: " + id));
    }

    @Override
    public List<City> listCities() {
        return cityRepository.findAll();
    }

    @Override
    public void deleteCity(Long id) {
        if (!cityRepository.existsById(id)) {
            throw new ResourceNotFoundException("City not found with id: " + id);
        }
        cityRepository.deleteById(id);
    }
}

