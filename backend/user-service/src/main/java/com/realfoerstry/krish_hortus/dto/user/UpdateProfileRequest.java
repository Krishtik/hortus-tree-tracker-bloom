package com.realfoerstry.krish_hortus.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

/*
 * ChangePasswordRequest DTO
 * ------------------------
 * This file defines the data structure used when a user wants to change their password.
 *
 * What does this DTO contain?
 * - oldPassword: The user's current password (required)
 * - newPassword: The user's new password (required, must be at least 8 characters)
 *
 * This is sent from the client to the server when changing a password.
 */

@Getter
@Setter
public class ChangePasswordRequest {
    @NotBlank(message = "Old password is required")
    private String oldPassword;

    @NotBlank(message = "New password is required")
    @Size(min = 8, message = "New password must be at least 8 characters")
    private String newPassword;

    public String getOldPassword() { return oldPassword; }
    public String getNewPassword() { return newPassword; }
}