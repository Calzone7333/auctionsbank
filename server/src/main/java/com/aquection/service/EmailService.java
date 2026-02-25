package com.aquection.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.frontend.url:https://madrasauction.com}")
    private String frontendUrl;

    public void sendVerificationEmail(String toEmail, String token) {
        String link = frontendUrl + "/verify-email?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@aquection.com");
        message.setTo(toEmail);
        message.setSubject("Verify your email - aquection");
        message.setText(
                "Welcome to aquection!\n\nPlease click the link below to verify your email address:\n" + link
                        + "\n\nIf you did not create an account, please ignore this email.");

        mailSender.send(message);
    }

    public void sendPasswordResetEmail(String toEmail, String token) {
        String link = frontendUrl + "/reset-password?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@aquection.com");
        message.setTo(toEmail);
        message.setSubject("Reset your password - aquection");
        message.setText(
                "You have requested to reset your password.\n\nPlease click the link below to set a new password:\n"
                        + link
                        + "\n\nIf you did not request this, please ignore this email. The link will expire in 24 hours.");

        mailSender.send(message);
    }
}
