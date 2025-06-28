package com.realfoerstry.krish_hortus.postgresql.entity.hierarchy;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class Location {

    @Id
    @GeneratedValue
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "profile_image_url")
    private String profileImageUrl;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "updated_by")
    private String updatedBy;

    @Column(name = "is_verified")
    private Boolean isVerified = false;

    @Column(name = "subscription_type")
    private String subscriptionType = "FREE";

    // If you have OTP, soft delete, etc., add them as nullable columns if needed
    @Column(name = "otp")
    private String otp;

    @Column(name = "soft_deleted_at")
    private LocalDateTime softDeletedAt;

    // Example for roles (if you have a UserRole entity)
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<TreePhoto> userRoles = new HashSet<>();

    // Helper method for roles
    public void addRole(Tree role) {
        TreePhoto userRole = new TreePhoto();
        userRole.setUser(this);
        userRole.setRole(role);
        userRole.setIsActive(true);
        this.userRoles.add(userRole);
    }
}