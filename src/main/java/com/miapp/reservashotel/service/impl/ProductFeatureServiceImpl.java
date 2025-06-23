package com.miapp.reservashotel.service.impl;

import com.miapp.reservashotel.exception.ResourceNotFoundException;
import com.miapp.reservashotel.model.ProductFeature;
import com.miapp.reservashotel.repository.ProductFeatureRepository;
import com.miapp.reservashotel.service.ProductFeatureService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductFeatureServiceImpl implements ProductFeatureService {

    private final ProductFeatureRepository repository;

    @Override
    public ProductFeature save(ProductFeature productFeature) {
        return repository.save(productFeature);
    }

    @Override
    public List<ProductFeature> findAll() {
        return repository.findAll();
    }

    @Override
    public ProductFeature findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ProductFeature not found with id: " + id));
    }

    @Override
    public void delete(Long id) {
        ProductFeature pf = findById(id);
        repository.delete(pf);
    }
}
