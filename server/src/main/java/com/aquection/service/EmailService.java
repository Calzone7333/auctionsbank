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

    public void sendPaymentSuccessEmail(String toEmail, String fullName, String orderId, String paymentId,
            long amount) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Premium membership activated - aquection");
        message.setText(
                "Dear " + fullName + ",\n\n" +
                        "Congratulations! Your payment of ₹" + amount + " was successful.\n\n" +
                        "Transaction Details:\n" +
                        "Order ID: " + orderId + "\n" +
                        "Payment ID: " + paymentId + "\n\n" +
                        "Your account has been upgraded to PREMIUM. You now have full access to all elite features.\n\n"
                        +
                        "Thank you for choosing aquection!\n\n" +
                        "Best regards,\n" +
                        "The aquection Team");

        mailSender.send(message);
    }
}
