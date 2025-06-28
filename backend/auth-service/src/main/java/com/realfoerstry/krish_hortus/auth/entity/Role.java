package com.realfoerstry.krish_hortus.auth.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "roles")
public class Role {

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public RoleName getName() {
        return name;
    }

    public void setName(RoleName name) {
        this.name = name;
    }
    public enum RoleName {
        ROLE_USER,
        ROLE_ADMIN,
        ROLE_MODERATOR
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(length = 30, unique = true)
    private RoleName name;

    // Getters and setters...
}