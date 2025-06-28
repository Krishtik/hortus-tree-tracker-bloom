package com.realfoerstry.krish_hortus.postgresql.entity.hierarchy;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

/*
 * Role Entity
 * -----------
 * This file defines the Role entity, which represents a role (permission group) in the system.
 *
 * What does this entity store?
 * - roleId: Unique identifier for the role
 * - name: The name of the role (e.g., 'ROLE_USER', 'ROLE_ADMIN')
 * - userRoles: The users who have this role (links to UserRole)
 *
 * Roles are used to control what users are allowed to do in the system.
 */
@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String roleId;

    @Column(unique = true, nullable = false)
    private String name;

    @OneToMany(mappedBy = "role", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<UserRole> userRoles = new HashSet<>();
}