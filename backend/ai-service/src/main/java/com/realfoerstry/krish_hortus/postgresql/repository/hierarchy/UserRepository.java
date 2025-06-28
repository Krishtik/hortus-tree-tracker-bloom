package com.realfoerstry.krish_hortus.postgresql.repository.hierarchy;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.realfoerstry.krish_hortus.postgresql.entity.hierarchy.Location;

import jakarta.transaction.Transactional;

@Repository
public interface UserRepository extends JpaRepository<Location, UUID> {

    @Query("SELECT u FROM User u WHERE u.fullName = :fullName")
    @EntityGraph(value = "User.roles", type = EntityGraph.EntityGraphType.LOAD)
    Optional<Location> findByFullName(@Param("fullName") String fullName);

    @Query("SELECT u FROM User u WHERE u.email = :email")
    @EntityGraph(value = "User.roles", type = EntityGraph.EntityGraphType.LOAD)
    Optional<Location> findByEmail(@Param("email") String email);

    @Query("SELECT u FROM User u WHERE lower(u.email) like %:loggedInUserEmail")
    List<Location> findAllNewUsers(@Param("loggedInUserEmail") String loggedInUserEmail);

    List<Location> findAllByFullNameIn(List<String> fullNames);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.otp = :otp WHERE u.email = :email")
    void updateOtp(@Param("email") String email, @Param("otp") String otp);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.isVerified = true, u.otp = NULL WHERE u.email = :email")
    void verifyUser(@Param("email") String email);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.passwordHash = :passwordHash WHERE u.email = :email")
    void updatePassword(@Param("email") String email, @Param("passwordHash") String passwordHash);
}