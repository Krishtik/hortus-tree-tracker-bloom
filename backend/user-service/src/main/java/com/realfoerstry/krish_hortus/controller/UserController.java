package com.realfoerstry.krish_hortus.controller;

import com.realfoerstry.krish_hortus.dto.user.UpdateProfileRequest;
import com.realfoerstry.krish_hortus.dto.user.ChangePasswordRequest;
import com.realfoerstry.krish_hortus.postgresql.entity.hierarchy.User;
import com.realfoerstry.krish_hortus.postgresql.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

/*
 * UserController
 * --------------
 * This file defines the REST API endpoints for managing user profiles in the user-service.
 *
 * What does this controller do?
 * - Lets a logged-in user view their profile (/api/user/profile, GET)
 * - Lets a logged-in user update their profile (/api/user/profile, PUT)
 * - Lets a logged-in user change their password (/api/user/change-password, POST)
 *
 * How does it work?
 * - It uses the UserService to do the actual work.
 * - It gets the user's identity from the JWT token (handled by Spring Security).
 *
 * This controller does NOT handle login or registration. That is done by the auth-service.
 */

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<User> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getProfile(userDetails.getUsername());
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(@AuthenticationPrincipal UserDetails userDetails,
                                              @Valid @RequestBody UpdateProfileRequest request) {
        User updatedUser = userService.updateProfile(userDetails.getUsername(), request);
        return ResponseEntity.ok(updatedUser);
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@AuthenticationPrincipal UserDetails userDetails,
                                            @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(userDetails.getUsername(), request);
        return ResponseEntity.ok().body("Password changed successfully");
    }
} 