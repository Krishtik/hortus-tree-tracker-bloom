package com.realfoerstry.krish_hortus.postgresql.service;

import com.realfoerstry.krish_hortus.dto.user.UpdateProfileRequest;
import com.realfoerstry.krish_hortus.dto.user.ChangePasswordRequest;
import com.realfoerstry.krish_hortus.exception.ResourceNotFoundException;
import com.realfoerstry.krish_hortus.postgresql.entity.hierarchy.User;
import com.realfoerstry.krish_hortus.postgresql.repository.hierarchy.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/*
 * UserService
 * -----------
 * This file contains the main business logic for user profile management in the user-service.
 *
 * What does this service do?
 * - Looks up a user's profile by their email address (getProfile)
 * - Updates a user's profile information (updateProfile)
 * - Changes a user's password (changePassword)
 *
 * This service is called by the UserController when a user makes a request.
 * It talks to the database using the UserRepository.
 */
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public User getProfile(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public User updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setFullName(request.getFullName());
        user.setProfileImageUrl(request.getProfileImageUrl());
        return userRepository.save(user);
    }

    public void changePassword(String email, ChangePasswordRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Old password is incorrect");
        }
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
} 