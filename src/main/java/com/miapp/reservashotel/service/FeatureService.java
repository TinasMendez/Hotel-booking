package com.miapp.reservashotel.service;

import com.miapp.reservashotel.model.Feature;

import java.util.List;
import java.util.Optional;

public interface FeatureService {
    Feature saveFeature(Feature feature);
    List<Feature> listFeatures();
    Optional<Feature> getFeatureById(Long id);
    Feature updateFeature(Long id, Feature feature);
    void deleteFeature(Long id);
}
