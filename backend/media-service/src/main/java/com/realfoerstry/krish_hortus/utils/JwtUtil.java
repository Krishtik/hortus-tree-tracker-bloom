package com.realfoerstry.krish_hortus.utils;


import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class JwtUtil {

    // Use at least 32 characters (256 bits) for HS256
    private static final String SECRET_KEY = "Ai24cSuperSecureRandomKeyWithMoreThan32Characters!";

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
    }

    private Jws<Claims> getClaimsFromToken(String token) {
        return Jwts.parser()
                .setSigningKey(getSigningKey())
                .parseClaimsJws(token);
    }
        private static final long ACCESS_TOKEN_EXPIRATION = 3600000; // 1 hour in ms
    private static final long REFRESH_TOKEN_EXPIRATION = 604800000; // 7 days in ms

    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRATION))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateRefreshToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public long getExpiration() {
        // Return expiration in seconds (for frontend)
        return ACCESS_TOKEN_EXPIRATION / 1000;
    }


    public String getEmailFromToken(String token) {
        return getClaimsFromToken(token).getBody().getSubject();
    }


    public boolean isTokenValid(String token) {
        try {
            Jws<Claims> claimsJws = getClaimsFromToken(token);
            return !claimsJws.getBody().getExpiration().before(new Date());
        } catch (Exception e) {
            log.error("Invalid JWT token: {}", e.getMessage());
            return false;
        }
    }
}
