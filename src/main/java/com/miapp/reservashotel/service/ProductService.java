package com.miapp.reservashotel.service;

import com.miapp.reservashotel.model.Product;

import java.util.List;
import java.util.Set;

public interface ProductService {

Product createProduct(Product product);
List<Product> listProducts();
void deleteProduct(Long id);
Product updateProduct(Long id, Product product);
void assignFeaturesToProduct(Long productId, Set<Long> featureIds);

}
