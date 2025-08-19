package com.miapp.reservashotel.service.impl;

import com.miapp.reservashotel.dto.FeatureRequestDTO;
import com.miapp.reservashotel.exception.ResourceNotFoundException;
import com.miapp.reservashotel.model.Feature;
import com.miapp.reservashotel.repository.FeatureRepository;
import com.miapp.reservashotel.service.FeatureService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Feature service without Lombok; manual constructor; basic CRUD.
 */
@Service
public class FeatureServiceImpl implements FeatureService {

    private final FeatureRepository featureRepository;

    public FeatureServiceImpl(FeatureRepository featureRepository) {
        this.featureRepository = featureRepository;
    }

    @Override
    public Feature createFromDTO(FeatureRequestDTO dto) {
        Feature f = new Feature();
        f.setName(dto.getName());
        f.setDescription(dto.getDescription());
        f.setIcon(dto.getIcon());
        return featureRepository.save(f);
    }

    @Override
    public Feature updateFromDTO(Long id, FeatureRequestDTO dto) {
        Feature f = featureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Feature not found with id: " + id));
        f.setName(dto.getName());
        f.setDescription(dto.getDescription());
        f.setIcon(dto.getIcon());
        return featureRepository.save(f);
    }

    @Override
    public Feature getFeatureById(Long id) {
        return featureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Feature not found with id: " + id));
    }

    @Override
    public List<Feature> listFeatures() {
        return featureRepository.findAll();
    }

    // Extra helper (not declared in interface) – used by controllers if needed
    public void deleteFeature(Long id) {
        if (!featureRepository.existsById(id)) {
            throw new ResourceNotFoundException("Feature not found with id: " + id);
        }
        featureRepository.deleteById(id);
    }
}
