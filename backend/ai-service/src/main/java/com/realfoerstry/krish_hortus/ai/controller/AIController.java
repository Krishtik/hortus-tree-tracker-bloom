package com.realfoerstry.krish_hortus.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.realfoerstry.krish_hortus.dto.auth.AuthRequest;
import com.realfoerstry.krish_hortus.dto.auth.RegisterRequest;
import com.realfoerstry.krish_hortus.postgresql.entity.hierarchy.Location;
import com.realfoerstry.krish_hortus.postgresql.service.H3Service;
import com.realfoerstry.krish_hortus.utils.JwtUtil;

@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/api/auth")
public class AIController {

    @Autowired
    private H3Service authService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody RegisterRequest request) {
        Location user = authService.signUp(request.getEmail(), request.getPassword(), request.getName());
        String token = jwtUtil.generateToken(user.getEmail());
        String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());
        long expiresIn = jwtUtil.getExpiration();

        Map<String, Object> response = new HashMap<>();
        response.put("user", user);
        response.put("token", token);
        response.put("refreshToken", refreshToken);
        response.put("expiresIn", expiresIn);
        response.put("message", "User registered. OTP sent to email.");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signUp(@RequestBody RegisterRequest request) {
        // Same as /register for compatibility
        return register(request);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody AuthRequest request) {
        Location user = authService.authenticate(request.getEmail(), request.getPassword());
        if (user == null) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Invalid email or password.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        String token = jwtUtil.generateToken(user.getEmail());
        String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());
        long expiresIn = jwtUtil.getExpiration();

        Map<String, Object> response = new HashMap<>();
        response.put("user", user);
        response.put("token", token);
        response.put("refreshToken", refreshToken);
        response.put("expiresIn", expiresIn);

        return ResponseEntity.ok(response);
    }

    // Add refresh and profile endpoints if needed for your frontend
}