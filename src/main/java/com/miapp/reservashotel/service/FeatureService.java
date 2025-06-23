package com.miapp.reservashotel.service;

import com.miapp.reservashotel.model.Feature;

import java.util.List;

/**
 * Defines the business logic for features.
 */
public interface FeatureService {
    Feature createFeature(Feature feature);
    List<Feature> listFeatures();
    Feature getFeatureById(Long id);
    Feature updateFeature(Long id, Feature feature);
    void deleteFeature(Long id);
}
