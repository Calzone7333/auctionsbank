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
import org.springframework.security.core.userdetails.UserDetails;
import com.aquection.security.UserDetailsImpl;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Value;
import com.aquection.dto.GoogleLoginRequest;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import java.util.Collections;
import java.util.Optional;

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

    @Value("${app.google.client-id}")
    private String googleClientId;

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

            // Auto-downgrade if expired
            if (user.getAccountType() == User.AccountType.PREMIUM && user.getPlanExpiryDate() != null) {
                if (user.getPlanExpiryDate().isBefore(java.time.LocalDateTime.now())) {
                    user.setAccountType(User.AccountType.FREE);
                    userRepository.save(user);
                }
            }

            return ResponseEntity.ok(new JwtResponse(
                    jwt,
                    user.getId(),
                    user.getEmail(),
                    user.getRole().name(),
                    user.getAccountType() != null ? user.getAccountType().name() : "FREE",
                    user.isVerified(),
                    user.isEmailVerified(),
                    user.getPlanExpiryDate()));
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

    @PostMapping("/google")
    public ResponseEntity<?> authenticateGoogleUser(@RequestBody GoogleLoginRequest request) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(),
                    new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(request.getToken());
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                String email = payload.getEmail();
                String name = (String) payload.get("name");

                Optional<User> userOptional = userRepository.findByEmail(email);
                User user;
                if (userOptional.isPresent()) {
                    user = userOptional.get();
                } else {
                    user = new User();
                    user.setEmail(email);
                    user.setFullName(name);
                    user.setRole(User.Role.USER);
                    user.setVerified(true);
                    user.setEmailVerified(true);
                    // generate a random password for google users or dummy
                    user.setPasswordHash(encoder.encode(java.util.UUID.randomUUID().toString()));
                    userRepository.save(user);
                }

                // Auto-downgrade if expired
                if (user.getAccountType() == User.AccountType.PREMIUM && user.getPlanExpiryDate() != null) {
                    if (user.getPlanExpiryDate().isBefore(java.time.LocalDateTime.now())) {
                        user.setAccountType(User.AccountType.FREE);
                        userRepository.save(user);
                    }
                }

                // Authenticate manually
                UserDetails userDetails = UserDetailsImpl.build(user);
                Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null,
                        userDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);

                String jwt = jwtUtils.generateJwtTokenFromUsername(user.getEmail());

                return ResponseEntity.ok(new JwtResponse(
                        jwt,
                        user.getId(),
                        user.getEmail(),
                        user.getRole().name(),
                        user.getAccountType() != null ? user.getAccountType().name() : "FREE",
                        user.isVerified(),
                        user.isEmailVerified(),
                        user.getPlanExpiryDate()));

            } else {
                return ResponseEntity.status(401).body("Error: Invalid Google ID token.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody java.util.Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body("Error: Email is required.");
        }

        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            String otp = String.format("%06d", new java.util.Random().nextInt(999999));
            user.setResetPasswordToken(otp);
            user.setResetPasswordTokenExpiry(java.time.LocalDateTime.now().plusMinutes(15));
            userRepository.save(user);

            try {
                emailService.sendPasswordResetEmail(user.getEmail(), otp);
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(500).body("Error: Failed to send email.");
            }
        }

        // Always return success even if email not found to prevent email enumeration
        return ResponseEntity
                .ok("If that email address is in our database, we will send you an OTP to reset your password.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody java.util.Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        String newPassword = request.get("password");

        if (email == null || email.isEmpty() || otp == null || otp.isEmpty() || newPassword == null
                || newPassword.isEmpty()) {
            return ResponseEntity.badRequest().body("Error: Email, OTP, and new password are required.");
        }

        Optional<User> userOptional = userRepository.findByEmail(email);
        if (!userOptional.isPresent()) {
            return ResponseEntity.badRequest().body("Error: Invalid email or OTP.");
        }

        User user = userOptional.get();
        if (user.getResetPasswordToken() == null || !user.getResetPasswordToken().equals(otp)) {
            return ResponseEntity.badRequest().body("Error: Invalid OTP.");
        }

        if (user.getResetPasswordTokenExpiry() == null
                || user.getResetPasswordTokenExpiry().isBefore(java.time.LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Error: OTP has expired.");
        }

        user.setPasswordHash(encoder.encode(newPassword));
        user.setResetPasswordToken(null);
        user.setResetPasswordTokenExpiry(null);
        userRepository.save(user);

        return ResponseEntity.ok("Password has been reset successfully.");
    }
}
