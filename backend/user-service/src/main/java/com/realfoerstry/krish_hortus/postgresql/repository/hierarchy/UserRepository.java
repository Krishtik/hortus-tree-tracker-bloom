package com.realfoerstry.krish_hortus.postgresql.repository.hierarchy;

import com.realfoerstry.krish_hortus.postgresql.entity.hierarchy.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    @EntityGraph(attributePaths = "userRoles")
    Optional<User> findByEmail(String email);

    @EntityGraph(attributePaths = "userRoles")
    Optional<User> findByUsername(String username);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.passwordHash = :passwordHash WHERE u.email = :email")
    void updatePassword(@Param("email") String email, @Param("passwordHash") String passwordHash);
}