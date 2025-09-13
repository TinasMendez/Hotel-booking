package com.miapp.reservashotel.service;

import com.miapp.reservashotel.dto.CityRequestDTO;
import com.miapp.reservashotel.model.City;

import java.util.List;

public interface CityService {
    City createFromDTO(CityRequestDTO dto);

    City updateFromDTO(Long id, CityRequestDTO dto);

    City getCityById(Long id);

    List<City> listCities();

    void deleteCity(Long id);
}
