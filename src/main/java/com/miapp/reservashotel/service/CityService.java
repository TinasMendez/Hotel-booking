package com.miapp.reservashotel.service;

import com.miapp.reservashotel.model.City;

import java.util.List;

public interface CityService {

    City saveCity(City city);

    City getCityById(Long id);

    List<City> listCities();

    City updateCity(Long id, City city);

    void deleteCity(Long id);
}
