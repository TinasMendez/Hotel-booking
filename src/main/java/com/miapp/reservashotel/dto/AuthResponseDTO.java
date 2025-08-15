package com.miapp.reservashotel.dto;

public class AuthResponseDTO {
    private String token;
    private String name;
    private String lastName;

    public AuthResponseDTO() {}

    public AuthResponseDTO(String token, String name, String lastName) {
        this.token = token;
        this.name = name;
        this.lastName = lastName;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
}