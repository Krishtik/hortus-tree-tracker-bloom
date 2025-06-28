package com.realfoerstry.krish_hortus.auth.service;

import com.realfoerstry.krish_hortus.auth.dto.*;
import com.realfoerstry.krish_hortus.auth.entity.Role;
import com.realfoerstry.krish_hortus.auth.entity.User;
import com.realfoerstry.krish_hortus.auth.entity.RefreshToken;
import com.realfoerstry.krish_hortus.auth.repository.RoleRepository;
import com.realfoerstry.krish_hortus.auth.repository.UserRepository;
import com.realfoerstry.krish_hortus.auth.repository.RefreshTokenRepository;
import com.realfoerstry.krish_hortus.auth.security.jwt.JwtUtils;
import com.realfoerstry.krish_hortus.auth.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final RefreshTokenRepository refreshTokenRepository;

    @Autowired
    public AuthService(AuthenticationManager authenticationManager,
                       UserRepository userRepository,
                       RoleRepository roleRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtils jwtUtils,
                       RefreshTokenRepository refreshTokenRepository) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
        this.refreshTokenRepository = refreshTokenRepository;
    }

    // LOGIN: Accepts LoginRequest DTO, returns JwtResponse DTO
    @Transactional
    public JwtResponse login(LoginRequest loginRequest) {
        // Accept username or email for login
        String login = loginRequest.getUsernameOrEmail();
        String password = loginRequest.getPassword();

        Optional<User> userOpt = userRepository.findByUsername(login);
        if (!userOpt.isPresent()) {
            userOpt = userRepository.findByEmail(login);
        }
        if (!userOpt.isPresent()) {
            throw new RuntimeException("Invalid username/email or password");
        }
        User user = userOpt.get();

        // Authenticate using username
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), password));
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtUtils.generateJwtToken(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());
        String refreshToken = createAndStoreRefreshToken(user);

        return new JwtResponse(jwt, user.getId(), user.getUsername(), user.getEmail(), roles, refreshToken);
    }

    // REGISTER: Accepts RegisterRequest DTO, returns JwtResponse DTO (auto-login after registration)
    @Transactional
    public JwtResponse register(RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

        Set<Role> roles = new HashSet<>();
        Set<String> strRoles = registerRequest.getRoles();
        if (strRoles == null || strRoles.isEmpty()) {
            Role userRole = roleRepository.findByName(Role.RoleName.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Role USER not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role.toLowerCase()) {
                    case "admin":
                        Role adminRole = roleRepository.findByName(Role.RoleName.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Role ADMIN not found."));
                        roles.add(adminRole);
                        break;
                    case "mod":
                    case "moderator":
                        Role modRole = roleRepository.findByName(Role.RoleName.ROLE_MODERATOR)
                                .orElseThrow(() -> new RuntimeException("Role MODERATOR not found."));
                        roles.add(modRole);
                        break;
                    default:
                        Role userRole = roleRepository.findByName(Role.RoleName.ROLE_USER)
                                .orElseThrow(() -> new RuntimeException("Role USER not found."));
                        roles.add(userRole);
                }
            });
        }
        user.setRoles(roles);
        userRepository.save(user);

        // Auto-login after registration
        return login(new LoginRequest(user.getUsername(), registerRequest.getPassword()));
    }

    // REFRESH TOKEN: Accepts RefreshRequest DTO, returns JwtResponse DTO
    public JwtResponse refreshToken(RefreshRequest refreshRequest) {
        String refreshTokenStr = refreshRequest.getRefreshToken();
        RefreshToken refreshToken = refreshTokenRepository.findByToken(refreshTokenStr)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));
        if (refreshToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            refreshTokenRepository.delete(refreshToken);
            throw new RuntimeException("Refresh token expired. Please login again.");
        }
        User user = refreshToken.getUser();
        UserDetailsImpl userDetails = UserDetailsImpl.build(user);
        String jwt = jwtUtils.generateJwtToken(
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities()));
        // Optionally rotate refresh token
        refreshTokenRepository.delete(refreshToken);
        String newRefreshToken = createAndStoreRefreshToken(user);
        List<String> roles = user.getRoles().stream().map(r -> r.getName().name()).collect(Collectors.toList());
        return new JwtResponse(jwt, user.getId(), user.getUsername(), user.getEmail(), roles, newRefreshToken);
    }

    // LOGOUT: Invalidate refresh tokens for the current user
    @Transactional
    public void logout() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication != null ? authentication.getName() : null;
        if (username != null) {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
            refreshTokenRepository.deleteByUser(user);
        }
    }

    // PROFILE: Get current user profile
    @Transactional
    public User getCurrentUserProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication != null ? authentication.getName() : null;
        if (username == null) {
            throw new RuntimeException("Unauthorized");
        }
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    // Helper: Create and store a refresh token for a user
    @Transactional
    private String createAndStoreRefreshToken(User user) {
        refreshTokenRepository.deleteByUser(user);
        String token = UUID.randomUUID().toString() + UUID.randomUUID();
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setToken(token);
        refreshToken.setExpiryDate(LocalDateTime.now().plusDays(30));
        refreshTokenRepository.save(refreshToken);
        return token;
    }
}