package com.miapp.reservashotel.service.impl;

import com.miapp.reservashotel.model.Feature;
import com.miapp.reservashotel.repository.FeatureRepository;
import com.miapp.reservashotel.service.FeatureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Implements business logic for managing features.
 */
@Service
public class FeatureServiceImpl implements FeatureService {

    @Autowired
    private FeatureRepository featureRepository;

    @Override
    public Feature createFeature(Feature feature) {
        return featureRepository.save(feature);
    }

    @Override
    public List<Feature> listFeatures() {
        return featureRepository.findAll();
    }

    @Override
    public Feature getFeatureById(Long id) {
        return featureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Feature not found with id: " + id));
    }

    @Override
    public Feature updateFeature(Long id, Feature feature) {
        Feature existing = getFeatureById(id);
        existing.setName(feature.getName());
        existing.setIcon(feature.getIcon());
        return featureRepository.save(existing);
    }

    @Override
    public void deleteFeature(Long id) {
        featureRepository.deleteById(id);
    }
}
