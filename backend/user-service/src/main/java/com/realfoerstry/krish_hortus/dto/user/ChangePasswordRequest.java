package com.realfoerstry.krish_hortus.dto.user;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/*
 * UpdateProfileRequest DTO
 * -----------------------
 * This file defines the data structure used when a user wants to update their profile.
 *
 * What does this DTO contain?
 * - fullName: The user's new full name (required)
 * - profileImageUrl: The user's new profile picture (optional)
 */

@Getter
@Setter
public class UpdateProfileRequest {
    @NotBlank(message = "Full name is required")
    private String fullName;
    private String profileImageUrl;

    public String getFullName() { return fullName; }
    public String getProfileImageUrl() { return profileImageUrl; }
}