package com.aquection.controller;

import com.aquection.dto.JwtResponse;
import com.aquection.dto.LoginRequest;
import com.aquection.dto.RegisterRequest;
import com.aquection.entity.User;
import com.aquection.repository.UserRepository;
import com.aquection.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    com.aquection.service.EmailService emailService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        System.out.println("Login request received for email: " + loginRequest.getEmail());
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            User user = userRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new RuntimeException("Error: User not found."));

            return ResponseEntity.ok(new JwtResponse(
                    jwt,
                    user.getId(),
                    user.getEmail(),
                    user.getRole().name(),
                    user.isVerified(),
                    user.isEmailVerified()));
        } catch (org.springframework.security.core.AuthenticationException e) {
            return ResponseEntity.status(401).body("Error: Unauthorized - " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        User user = new User();
        user.setEmail(signUpRequest.getEmail());
        user.setPasswordHash(encoder.encode(signUpRequest.getPassword()));
        user.setFullName(signUpRequest.getFullName());
        user.setPhoneNumber(signUpRequest.getPhoneNumber());

        user.setRole(User.Role.USER);
        user.setVerified(true); // Regular users are verified by default

        user.setEmailVerificationToken(java.util.UUID.randomUUID().toString());
        user.setEmailVerified(false);

        userRepository.save(user);

        try {
            emailService.sendVerificationEmail(user.getEmail(), user.getEmailVerificationToken());
        } catch (Exception e) {
            e.printStackTrace();
        }

        return ResponseEntity.ok("User registered successfully! Please check your email to verify your account.");
    }

    @GetMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {
        User user = userRepository.findByEmailVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("Error: Invalid verification token."));
        user.setEmailVerified(true);
        user.setEmailVerificationToken(null);
        userRepository.save(user);
        return ResponseEntity.ok("Email verified successfully!");
    }
}
