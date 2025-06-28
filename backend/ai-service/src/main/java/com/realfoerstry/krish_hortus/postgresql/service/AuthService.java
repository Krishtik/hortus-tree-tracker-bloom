package com.realfoerstry.krish_hortus.postgresql.service;

import java.time.LocalDateTime;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.realfoerstry.krish_hortus.exception.ResourceNotFoundException;
import com.realfoerstry.krish_hortus.postgresql.entity.hierarchy.User;
import com.realfoerstry.krish_hortus.postgresql.repository.hierarchy.UserRepository;
import com.realfoerstry.krish_hortus.utils.JwtUtil;

import jakarta.validation.ValidationException;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Autowired
    private JwtUtil jwtUtil;

    // 1️⃣ Sign Up (User Registration + OTP)
    public void signUp(String email, String password) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new ValidationException("User already exists");
        }

        String hashedPassword = passwordEncoder.encode(password);
        String otp = generateOtp();

        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(hashedPassword);
        user.setOtp(otp);
        user.setIsVerified(false);
        user.setCreatedAt(LocalDateTime.now());
        user.setCreatedBy(email);  //Updating same user who is doing self-signup

        userRepository.save(user);
        emailService.sendOtp(email, otp);
    }

    // 2️⃣ Verify OTP
    public String verifyOtp(String email, String otp) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user == null || !user.getOtp().equals(otp)) {
            throw new ValidationException("Invalid OTP");
        }

        user.setIsVerified(true);
        user.setOtp(null); // Clear OTP after verification
        user.setUpdatedBy(email);  //Updating same user who is verifying Otp (after self-signup)
        userRepository.save(user);

        return jwtUtil.generateToken(email);
    }

    // 3️⃣ Sign In
    public String signIn(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!user.getIsVerified()) {
            throw new ValidationException("User not verified");
        }

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new ValidationException("Invalid credentials");
        }
        return jwtUtil.generateToken(email);
    }

    // 4️⃣ Forgot Password (Sends OTP)
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String otp = generateOtp();
        user.setOtp(otp);
        user.setUpdatedBy(email);  //Updating same user who forgotPassword & generated Otp
        userRepository.save(user);

        emailService.sendOtp(email, otp);
    }

    // 5️⃣ Verify Reset OTP
    public boolean verifyResetOtp(String email, String otp) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return user != null && user.getOtp().equals(otp);
    }

    // 6️⃣ Reset Password (After OTP Verification)
    public void resetPassword(String email, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String hashedPassword = passwordEncoder.encode(newPassword);
        user.setPasswordHash(hashedPassword);
        user.setOtp(null); // Clear OTP after reset
        user.setUpdatedBy(email);  //Updating same user who is doing resetPassword
        userRepository.save(user);
    }

    // 7️⃣ Resend OTP (For Signup or Forgot Password)
    public void resendOtp(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String newOtp = generateOtp();
        user.setOtp(newOtp);
        user.setUpdatedBy(email);  //Updating same user who is doing resendOtp
        userRepository.save(user);

        emailService.sendOtp(email, newOtp);
    }

    // Helper Method: Generate 6-digit OTP
    private String generateOtp() {
        return String.valueOf(new Random().nextInt(900000) + 100000);
    }
}
