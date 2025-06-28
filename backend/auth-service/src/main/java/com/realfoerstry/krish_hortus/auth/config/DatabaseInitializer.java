package com.realfoerstry.krish_hortus.auth.config;

import com.realfoerstry.krish_hortus.auth.entity.Role;
import com.realfoerstry.krish_hortus.auth.entity.User;
import com.realfoerstry.krish_hortus.auth.repository.RoleRepository;
import com.realfoerstry.krish_hortus.auth.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

/**
 * Initializes the database with default roles and an admin user if not present.
 * Runs at application startup.
 */
@Component
public class DatabaseInitializer implements CommandLineRunner {
    private static final Logger logger = LoggerFactory.getLogger(DatabaseInitializer.class);

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${app.admin.username:admin}")
    private String adminUsername;

    @Value("${app.admin.email:admin@hortus.com}")
    private String adminEmail;

    @Value("${app.admin.password:admin123}")
    private String adminPassword;

    @Override
    public void run(String... args) throws Exception {
        initRoles();
        initAdminUser();
    }

    private void initRoles() {
        // Create roles if they don't exist
        for (Role.RoleName role : Role.RoleName.values()) {
            if (!roleRepository.findByName(role).isPresent()) {
                Role newRole = new Role();
                newRole.setName(role);
                roleRepository.save(newRole);
                logger.info("Created role: {}", role);
            }
        }
    }

    private void initAdminUser() {
        // Create admin user if it doesn't exist
        if (!userRepository.existsByUsername(adminUsername)) {
            User admin = new User();
            admin.setUsername(adminUsername);
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            // admin.setFirstName("Admin"); // Uncomment if you have these fields
            // admin.setLastName("User");
            Set<Role> roles = new HashSet<>();
            Role adminRole = roleRepository.findByName(Role.RoleName.ROLE_ADMIN)
                    .orElseThrow(() -> new RuntimeException("Error: Admin Role not found."));
            Role modRole = roleRepository.findByName(Role.RoleName.ROLE_MODERATOR)
                    .orElseThrow(() -> new RuntimeException("Error: Moderator Role not found."));
            Role userRole = roleRepository.findByName(Role.RoleName.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: User Role not found."));
            roles.add(adminRole);
            roles.add(modRole);
            roles.add(userRole);
            admin.setRoles(roles);
            userRepository.save(admin);
            logger.info("Created admin user: {}", adminUsername);
        }
    }
}