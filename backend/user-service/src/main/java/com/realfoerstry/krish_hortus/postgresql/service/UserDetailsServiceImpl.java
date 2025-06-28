package com.realfoerstry.krish_hortus.postgresql.service;

import com.realfoerstry.krish_hortus.postgresql.entity.hierarchy.User;
import com.realfoerstry.krish_hortus.postgresql.repository.hierarchy.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

/*
 * UserDetailsServiceImpl
 * ---------------------
 * Looks up user details by username (not email) for JWT authentication.
 * This matches the 'sub' claim in your JWT, which is the username.
 */

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        List<GrantedAuthority> authorities = user.getUserRoles().stream()
                .map(userRole -> new SimpleGrantedAuthority(userRole.getRole().getName()))
                .collect(Collectors.toList());

        // Use username as principal, since JWT 'sub' is username
        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), authorities);
    }
}