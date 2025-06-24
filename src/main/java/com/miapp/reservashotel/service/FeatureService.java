package com.miapp.reservashotel.service;

import com.miapp.reservashotel.dto.FeatureRequestDTO;
import com.miapp.reservashotel.model.Feature;

import java.util.List;

public interface FeatureService {

    Feature createFromDTO(FeatureRequestDTO dto);

    Feature updateFromDTO(Long id, FeatureRequestDTO dto);

    Feature getFeatureById(Long id);

    List<Feature> listFeatures();

    void deleteFeature(Long id);
}
