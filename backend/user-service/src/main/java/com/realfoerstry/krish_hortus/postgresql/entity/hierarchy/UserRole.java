package com.realfoerstry.krish_hortus.postgresql.entity.hierarchy;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

/*
 * UserRole Entity
 * ---------------
 * This file defines the UserRole entity, which links users to their roles (permissions).
 *
 * What is this for?
 * - In most systems, a user can have one or more roles (like 'admin', 'user', etc.).
 * - This entity creates a link between a user and a role.
 *
 * What does this entity store?
 * - id: Unique identifier for this link
 * - user: The user who has the role
 * - role: The role assigned to the user
 * - isActive: Whether this role is currently active for the user
 *
 * This is called a 'join table' in database design.
 */

@Entity
@Table(name = "user_roles")
@Getter
@Setter
@NoArgsConstructor
public class UserRole implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @Column(name = "is_active")
    private Boolean isActive = true;

    // Convenience getter for role name (for authorities mapping)
    public String getRoleName() {
        return role != null ? role.getName() : null;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UserRole that)) return false;
        return id != null && id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0;
    }
}