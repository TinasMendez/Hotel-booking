package com.miapp.reservashotel.dto;

import java.util.Set;

/**
 * Response DTO to show user's id, email and role names.
 * - Manual getters/setters (no Lombok).
 * - No-args and all-args constructors to support different mapping styles.
 */
public class UserRolesResponseDTO {

    private Long id;
    private String email;
    private Set<String> roles;

    public UserRolesResponseDTO() {
    }

    public UserRolesResponseDTO(Long id, String email, Set<String> roles) {
        this.id = id;
        this.email = email;
        this.roles = roles;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) { // needed by service mapping via setters
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) { // needed by service mapping via setters
        this.email = email;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) { // needed by service mapping via setters
        this.roles = roles;
    }
}

