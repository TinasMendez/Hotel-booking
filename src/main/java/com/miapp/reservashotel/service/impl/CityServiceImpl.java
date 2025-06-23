package com.miapp.reservashotel.service.impl;

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
    public City saveCity(City city) {
        return cityRepository.save(city);
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
    public City updateCity(Long id, City updatedCity) {
        City city = getCityById(id);
        city.setName(updatedCity.getName());
        city.setCountry(updatedCity.getCountry());
        return cityRepository.save(city);
    }

    @Override
    public void deleteCity(Long id) {
        City city = getCityById(id);
        cityRepository.delete(city);
    }
}
