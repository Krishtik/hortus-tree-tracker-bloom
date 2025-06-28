package com.realfoerstry.krish_hortus.auth.repository;

import com.realfoerstry.krish_hortus.auth.entity.RefreshToken;
import com.realfoerstry.krish_hortus.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    void deleteByUser(User user);
}