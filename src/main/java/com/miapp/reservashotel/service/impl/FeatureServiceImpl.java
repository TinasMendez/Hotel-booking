package com.miapp.reservashotel.service.impl;

import com.miapp.reservashotel.dto.FeatureRequestDTO;
import com.miapp.reservashotel.exception.ResourceNotFoundException;
import com.miapp.reservashotel.model.Feature;
import com.miapp.reservashotel.repository.FeatureRepository;
import com.miapp.reservashotel.service.FeatureService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FeatureServiceImpl implements FeatureService {

    private final FeatureRepository featureRepository;

    @Override
    public Feature createFromDTO(FeatureRequestDTO dto) {
        Feature feature = new Feature();
        feature.setName(dto.getName());
        feature.setDescription(dto.getDescription());
        feature.setIcon(dto.getIcon());
        return featureRepository.save(feature);
    }

    @Override
    public Feature updateFromDTO(Long id, FeatureRequestDTO dto) {
        Feature existing = featureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Feature not found with id: " + id));
        existing.setName(dto.getName());
        existing.setDescription(dto.getDescription());
        existing.setIcon(dto.getIcon());
        return featureRepository.save(existing);
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

    @Override
    public void deleteFeature(Long id) {
        if (!featureRepository.existsById(id)) {
            throw new ResourceNotFoundException("Feature not found with id: " + id);
        }
        featureRepository.deleteById(id);
    }
}
