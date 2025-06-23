package com.miapp.reservashotel.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Represents a customer entity stored in the database.
 */
@Entity
@Table(name = "customers")
@Getter
@Setter
@NoArgsConstructor
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Full name must not be blank
    @NotBlank(message = "Name is required")
    private String name;

    // Valid email is required
    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    // Optional phone, but if present, must match a simple pattern (digits, +, -, spaces)
    @Pattern(regexp = "^[0-9\\-\\+\\s]*$", message = "Phone number contains invalid characters")
    private String phone;
}

