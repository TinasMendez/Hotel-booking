package com.miapp.reservashotel.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Registration payload aligned with AuthController expectations.
 * Includes firstName and lastName fields.
 */
public class RegisterRequest {

    @NotBlank(message = "First name is required")
    @Size(max = 60, message = "First name must be at most 60 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 60, message = "Last name must be at most 60 characters")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 100, message = "Password must be 8-100 characters")
    private String password;

    public RegisterRequest() {}

    public RegisterRequest(String firstName, String lastName, String email, String password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
    }

    // --- Getters & Setters (no Lombok) ---
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}


