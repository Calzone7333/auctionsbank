package com.aquection.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendVerificationEmail(String toEmail, String token) {
        String link = "http://localhost:5173/verify-email?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@aquection.com");
        message.setTo(toEmail);
        message.setSubject("Verify your email - Aquection");
        message.setText("Welcome to Aquection!\n\nPlease click the link below to verify your email address:\n" + link
                + "\n\nIf you did not create an account, please ignore this email.");

        mailSender.send(message);
    }
}
