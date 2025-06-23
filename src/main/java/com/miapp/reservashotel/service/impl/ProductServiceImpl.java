package com.miapp.reservashotel.service.impl;

import com.miapp.reservashotel.model.Feature;
import com.miapp.reservashotel.model.Product;
import com.miapp.reservashotel.repository.FeatureRepository;
import com.miapp.reservashotel.repository.ProductRepository;
import com.miapp.reservashotel.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Implementation of ProductService containing business logic for products.
 */
@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private FeatureRepository featureRepository;

    @Override
    public Product crearProducto(Product product) {
        // Validation: prevent duplicate product names
        if (productRepository.existsByNombre(product.getNombre())) {
            throw new RuntimeException("Product with this name already exists.");
        }
        return productRepository.save(product);
    }

    @Override
    public List<Product> listarProductos() {
        return productRepository.findAll();
    }

    @Override
    public void eliminarProducto(Long id) {
        productRepository.deleteById(id);
    }

    @Override
    public Product actualizarProducto(Long id, Product productoActualizado) {
        Product productoExistente = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        productoExistente.setNombre(productoActualizado.getNombre());
        productoExistente.setDescripcion(productoActualizado.getDescripcion());
        productoExistente.setImagenUrl(productoActualizado.getImagenUrl());

        return productRepository.save(productoExistente);
    }

    @Override
    public void assignFeaturesToProduct(Long productId, Set<Long> featureIds) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        Set<Feature> features = new HashSet<>();
        for (Long featureId : featureIds) {
            Feature feature = featureRepository.findById(featureId)
                    .orElseThrow(() -> new RuntimeException("Feature not found with id: " + featureId));
            features.add(feature);
        }

        product.setFeatures(features);
        productRepository.save(product);
    }
}
