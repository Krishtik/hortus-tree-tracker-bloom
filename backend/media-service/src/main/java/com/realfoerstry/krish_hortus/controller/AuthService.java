package com.realfoerstry.krish_hortus.postgresql.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.realfoerstry.krish_hortus.dto.auth.RegisterRequest;
import com.realfoerstry.krish_hortus.postgresql.entity.hierarchy.User;
import com.realfoerstry.krish_hortus.postgresql.repository.hierarchy.UserRepository;

import jakarta.validation.ValidationException;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User signUp(String email, String password, String name) {
        if (userRepository.existsByEmail(email)) {
            throw new ValidationException("User already exists");
        }
        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setFullName(name);
        user.setIsVerified(false);
        // set other fields as needed
        return userRepository.save(user);
    }

    public User authenticate(String email, String password) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) return null;
        if (!passwordEncoder.matches(password, user.getPasswordHash())) return null;
        return user;
    }
}