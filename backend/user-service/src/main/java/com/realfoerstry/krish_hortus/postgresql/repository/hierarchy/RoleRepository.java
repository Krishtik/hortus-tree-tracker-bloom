package com.realfoerstry.krish_hortus.postgresql.repository.hierarchy;

import com.realfoerstry.krish_hortus.postgresql.entity.hierarchy.Role;
import com.realfoerstry.krish_hortus.postgresql.entity.hierarchy.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/*
 * RoleRepository
 * --------------
 * This file defines the RoleRepository, which is used to access role data in the database.
 *
 * What does this repository do?
 * - Lets you find a role by its name (findByName)
 *
 * This is used by the UserService and other services to check user permissions.
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(String name);
} 