package com.miapp.reservashotel.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * Request DTO to change user roles by email.
 */
public class AdminRoleRequestDTO {

    @NotBlank
    @Email
    private String email;

    public AdminRoleRequestDTO() {}

    public AdminRoleRequestDTO(String email) {
        this.email = email;
    }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}

