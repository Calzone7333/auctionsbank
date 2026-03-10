package com.aquection.controller;

import com.aquection.entity.User;
import com.aquection.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = userDetails.getUsername();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Error: User not found."));

        // Auto-downgrade if expired
        if (user.getAccountType() == User.AccountType.PREMIUM && user.getPlanExpiryDate() != null) {
            if (user.getPlanExpiryDate().isBefore(java.time.LocalDateTime.now())) {
                user.setAccountType(User.AccountType.FREE);
                userRepository.save(user);
            }
        }

        return ResponseEntity.ok(user);
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        if (!isAdmin()) {
            return ResponseEntity.status(403).body("Admin role required");
        }
        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("totalUsers", userRepository.count());
        return ResponseEntity.ok(stats);
    }

    @GetMapping
    public java.util.List<User> getAllUsers() {
        if (!isAdmin()) {
            throw new org.springframework.security.access.AccessDeniedException("Admin role required");
        }
        return userRepository.findAll();
    }

    @PatchMapping("/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody java.util.Map<String, String> request) {
        if (!isAdmin()) {
            return ResponseEntity.status(403).body("Admin role required");
        }
        String newRoleStr = request.get("role");
        if (newRoleStr == null) {
            return ResponseEntity.badRequest().body("Role cannot be null");
        }

        try {
            User.Role newRole = User.Role.valueOf(newRoleStr.toUpperCase());
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Error: User not found."));

            user.setRole(newRole);
            userRepository.save(user);
            return ResponseEntity.ok(user);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid role specified.");
        }
    }

    private boolean isAdmin() {
        org.springframework.security.core.Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) return false;
        Object principal = auth.getPrincipal();
        if (principal instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) principal;
            return userRepository.findByEmail(userDetails.getUsername())
                .map(u -> u.getRole() == User.Role.ADMIN)
                .orElse(false);
        }
        return false;
    }
}
