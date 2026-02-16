package com.aquection.controller;

import com.aquection.entity.ContactMessage;
import com.aquection.repository.ContactMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "http://localhost:5173")
public class ContactController {

    @Autowired
    private ContactMessageRepository contactMessageRepository;

    @PostMapping
    public ResponseEntity<?> submitContactMessage(@RequestBody ContactMessage message) {
        try {
            contactMessageRepository.save(message);
            return ResponseEntity.ok("Message received successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error submitting message: " + e.getMessage());
        }
    }
}
