package com.miapp.reservashotel.dto;

import java.math.BigDecimal;
import java.util.Set;

import com.miapp.reservashotel.model.Feature;
import com.miapp.reservashotel.model.Category;
import com.miapp.reservashotel.model.City;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponseDTO {
    private Long id;
    private String name;
    private String description;
    private String imageUrl;
    private BigDecimal price;
    private Boolean available;
    private Category category;
    private City city;
    private Set<Feature> features;
}

