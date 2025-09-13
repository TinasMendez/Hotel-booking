package com.miapp.reservashotel.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * User entity without Lombok. Email is the unique username for authentication.
 */
@Entity
@Table(name = "users", indexes = {
        @Index(name = "idx_users_email", columnList = "email", unique = true)
})
public class User implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="first_name", nullable = false, length = 80)
    private String firstName;

    @Column(name="last_name", nullable = false, length = 80)
    private String lastName;

    @Column(name="email", nullable = false, unique = true, length = 120)
    private String email;

    @JsonIgnore
    @Column(name="password", nullable = false)
    private String password;

    @Column(name="enabled", nullable = false)
    private boolean enabled = true;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_roles",
            joinColumns = @JoinColumn(name="user_id"),
            inverseJoinColumns = @JoinColumn(name="role_id"))
    private Set<Role> roles = new HashSet<>();

    public User() {
    }

    public User(String firstName, String lastName, String email, String password, boolean enabled) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email.toLowerCase();
        this.password = password;
        this.enabled = enabled;
    }

    // Utility helpers
    public void addRole(Role role) {
        if (role != null) {
            this.roles.add(role);
        }
    }

    // Getters and setters (manual, no Lombok)
    public Long getId() {
        return id;
    }

    public void setId(Long id) { this.id = id; }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) { this.email = email == null ? null : email.toLowerCase(); }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) { this.password = password; }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) { this.enabled = enabled; }

    public Set<Role> getRoles() { return roles; }

    public void setRoles(Set<Role> roles) { this.roles = roles; }
}



