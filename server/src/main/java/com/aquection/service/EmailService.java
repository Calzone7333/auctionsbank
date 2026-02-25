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

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendVerificationEmail(String toEmail, String token) {
        String link = frontendUrl + "/verify-email?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Verify your email - aquection");
        message.setText(
                "Welcome to aquection!\n\nPlease click the link below to verify your email address:\n" + link
                        + "\n\nIf you did not create an account, please ignore this email.");

        mailSender.send(message);
    }

    public void sendPasswordResetEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Password Reset OTP - aquection");
        message.setText(
                "You have requested to reset your password.\n\n" +
                        "Your One-Time Password (OTP) is: " + otp + "\n\n" +
                        "Please enter this OTP to set a new password. This OTP will expire in 15 minutes.\n\n" +
                        "If you did not request this, please ignore this email.");

        mailSender.send(message);
    }
}
