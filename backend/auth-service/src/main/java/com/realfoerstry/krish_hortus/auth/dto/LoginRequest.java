package com.realfoerstry.krish_hortus.auth.dto;

import jakarta.validation.constraints.NotBlank;

public class LoginRequest {
    @NotBlank
    private String usernameOrEmail;
    @NotBlank
    private String password;
    public String getUsernameOrEmail() {
        return usernameOrEmail;
    }
    public void setUsernameOrEmail(String usernameOrEmail) {
        this.usernameOrEmail = usernameOrEmail;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public LoginRequest(@NotBlank String usernameOrEmail, @NotBlank String password) {
        this.usernameOrEmail = usernameOrEmail;
        this.password = password;
    }

    // Getters and setters...
}