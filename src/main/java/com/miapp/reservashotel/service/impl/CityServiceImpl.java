// src/main/java/com/miapp/reservashotel/service/impl/CityServiceImpl.java

package com.miapp.reservashotel.service.impl;

import com.miapp.reservashotel.model.City;
import com.miapp.reservashotel.repository.CityRepository;
import com.miapp.reservashotel.service.CityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CityServiceImpl implements CityService {

    @Autowired
    private CityRepository cityRepository;

    @Override
    public City createCity(City city) {
        return cityRepository.save(city);
    }

    @Override
    public List<City> listCities() {
        return cityRepository.findAll();
    }

    @Override
    public City getCityById(Long id) {
        return cityRepository.findById(id).orElseThrow(() -> new RuntimeException("City not found with id: " + id));
    }

    @Override
    public void deleteCity(Long id) {
        cityRepository.deleteById(id);
    }
}
