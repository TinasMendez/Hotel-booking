package com.miapp.reservashotel.service.impl;

import com.miapp.reservashotel.dto.CityRequestDTO;
import com.miapp.reservashotel.exception.ResourceNotFoundException;
import com.miapp.reservashotel.model.City;
import com.miapp.reservashotel.repository.CityRepository;
import com.miapp.reservashotel.service.CityService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * City service implementation without Lombok.
 * Matches CityService signature (returns City entity, not DTOs).
 */
@Service
@Transactional
public class CityServiceImpl implements CityService {

    private final CityRepository cityRepository;

    public CityServiceImpl(CityRepository cityRepository) {
        this.cityRepository = cityRepository;
    }

    @Override
    public City createFromDTO(CityRequestDTO dto) {
        City city = new City();
        city.setName(dto.getName());
        city.setCountry(dto.getCountry());
        return cityRepository.save(city);
    }

    @Override
    public City updateFromDTO(Long id, CityRequestDTO dto) {
        City city = cityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("City not found id=" + id));
        city.setName(dto.getName());
        city.setCountry(dto.getCountry());
        return cityRepository.save(city);
    }

    @Override
    public City getCityById(Long id) {
        return cityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("City not found id=" + id));
    }

    @Override
    public List<City> listCities() {
        return cityRepository.findAll();
    }

    @Override
    public void deleteCity(Long id) {
        if (!cityRepository.existsById(id)) {
            throw new ResourceNotFoundException("City not found id=" + id);
        }
        cityRepository.deleteById(id);
    }
}



