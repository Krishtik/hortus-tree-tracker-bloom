package com.realfoerstry.krish_hortus.auth.dto;

import java.util.List;
import java.util.UUID;

public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private UUID id;
    private String username;
    private String email;
    private List<String> roles;
    private String refreshToken;
public JwtResponse(String token, UUID id, String username, String email, List<String> roles, String refreshToken) {
    this.token = token;
    this.type = "Bearer";
    this.id = id;
    this.username = username;
    this.email = email;
    this.roles = roles;
    this.refreshToken = refreshToken;
}
    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }
    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }
    public UUID getId() {
        return id;
    }
    public void setId(UUID id) {
        this.id = id;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public List<String> getRoles() {
        return roles;
    }
    public void setRoles(List<String> roles) {
        this.roles = roles;
    }
    public String getRefreshToken() {
        return refreshToken;
    }
    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    // Constructor, getters, setters...
}