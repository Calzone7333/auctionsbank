package com.aquection.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@com.fasterxml.jackson.annotation.JsonInclude(com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private String passwordHash;

    private String fullName;

    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    private Role role;

    @com.fasterxml.jackson.annotation.JsonProperty("isVerified")
    @Column(name = "is_verified")
    private boolean verified = false;

    @com.fasterxml.jackson.annotation.JsonProperty("isEmailVerified")
    @Column(name = "is_email_verified")
    private boolean emailVerified = false;

    @com.fasterxml.jackson.annotation.JsonIgnore
    private String emailVerificationToken;

    @com.fasterxml.jackson.annotation.JsonIgnore
    private String resetPasswordToken;

    @com.fasterxml.jackson.annotation.JsonIgnore
    private java.time.LocalDateTime resetPasswordTokenExpiry;

    @Enumerated(EnumType.STRING)
    private AccountType accountType = AccountType.FREE;

    private LocalDateTime planExpiryDate;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum Role {
        USER,
        ADMIN
    }

    public enum AccountType {
        FREE,
        PREMIUM
    }
}
