package com.miapp.reservashotel.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Set;

@Getter
@Setter
public class ProductRequestDTO {
    private String name;
    private String description;
    private String imageUrl;
    private BigDecimal price;
    private boolean available;
    private Long categoryId;
    private Long cityId;
    private Set<Long> featureIds;
}

