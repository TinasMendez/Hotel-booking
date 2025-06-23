package com.miapp.reservashotel.service.impl;

import com.miapp.reservashotel.model.Feature;
import com.miapp.reservashotel.repository.FeatureRepository;
import com.miapp.reservashotel.service.FeatureService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FeatureServiceImpl implements FeatureService {

    @Autowired
    private FeatureRepository featureRepository;

    @Override
    public Feature saveFeature(Feature feature) {
        return featureRepository.save(feature);
    }

    @Override
    public List<Feature> listFeatures() {
        return featureRepository.findAll();
    }

    @Override
    public Optional<Feature> getFeatureById(Long id) {
        return featureRepository.findById(id);
    }

    @Override
    public Feature updateFeature(Long id, Feature feature) {
        Feature existing = featureRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Feature not found with id " + id));
        existing.setName(feature.getName());
        existing.setIcon(feature.getIcon());
        return featureRepository.save(existing);
    }

    @Override
    public void deleteFeature(Long id) {
        featureRepository.deleteById(id);
    }
}

