package com.miapp.reservashotel.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Entity
@Table(name = "cities")
@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties("products")
public class City {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "City name is required")
    @Size(max = 100, message = "City name must be less than 100 characters")
    private String name;

    @NotBlank(message = "Country is required")
    @Size(max = 100, message = "Country name must be less than 100 characters")
    private String country;

    @OneToMany(mappedBy = "city")
    private Set<Product> products;
}
