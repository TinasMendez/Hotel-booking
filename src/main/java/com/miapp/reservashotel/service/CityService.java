package com.miapp.reservashotel.service;

import com.miapp.reservashotel.model.City;

import java.util.List;

public interface CityService {
    City createCity(City city);

    List<City> listCities();

    City getCityById(Long id);

    void deleteCity(Long id);
}
