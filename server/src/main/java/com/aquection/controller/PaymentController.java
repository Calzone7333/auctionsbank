package com.aquection.controller;

import com.aquection.dto.PaymentOrderResponse;
import com.aquection.entity.User;
import com.aquection.repository.UserRepository;
import com.aquection.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/key")
    public ResponseEntity<?> getKey() {
        return ResponseEntity.ok(Collections.singletonMap("key", paymentService.getKeyId()));
    }

    @PostMapping("/create-order")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> data) {
        try {
            double amount = Double.parseDouble(data.get("amount").toString());
            User user = getCurrentUser();
            PaymentOrderResponse response = paymentService.createOrder(amount, user);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating order: " + e.getMessage());
        }
    }

    @PostMapping("/verify-payment")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> data) {
        User user = getCurrentUser();
        boolean isVerified = paymentService.verifyAndConfirmPayment(data, user);

        if (isVerified) {
            return ResponseEntity.ok(Map.of("status", "success", "message", "Payment verified and account upgraded"));
        } else {
            return ResponseEntity.badRequest()
                    .body(Map.of("status", "error", "message", "Payment verification failed"));
        }
    }

    private User getCurrentUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
