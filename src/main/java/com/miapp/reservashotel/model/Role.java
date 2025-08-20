package com.miapp.reservashotel.model;

import jakarta.persistence.*;
import java.io.Serializable;

/**
 * Role entity without Lombok. Represents application roles like ROLE_USER and ROLE_ADMIN.
 */
@Entity
@Table(name = "roles")
public class Role implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="name", unique = true, nullable = false, length = 50)
    private String name;

    public Role() {
    }

    public Role(String name) {
        this.name = name;
    }

    // Getters and setters (manual, no Lombok)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}




