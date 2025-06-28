package com.realfoerstry.krish_hortus.auth.repository;

import com.realfoerstry.krish_hortus.auth.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(Role.RoleName name);
}