package com.miapp.reservashotel.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Register payload for new users.
 */
public class RegisterRequest {

    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 80)
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 80)
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email
    @Size(max = 120)
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 100)
    private String password;

    public RegisterRequest() {
    }

    public RegisterRequest(String firstName, String lastName, String email, String password) {
        this.firstName = firstName;
        this.lastName  = lastName;
        this.email     = email;
        this.password  = password;
    }

    // Getters and setters (manual)
    public String getFirstName() { return firstName; }

    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }

    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }

    public void setPassword(String password) { this.password = password; }
}

