package com.aquection.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "auctions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Auction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String bankName;

    private String cityName;

    private String propertyType; // Residential, Commercial, etc.

    private BigDecimal reservePrice;

    private BigDecimal emdAmount;

    private LocalDateTime auctionDate;

    private String noticeUrl;

    // Detailed Fields
    private String area;
    private String facing;
    private String possession; // Physical, Symbolic
    private String ownership; // Freehold, Leasehold
    private String contactOfficer;
    private String contactNumber;

    private BigDecimal bidIncrement;

    private LocalDateTime inspectionDate;
    private LocalDateTime emdLastDate;

    private String createdByEmail;

    private boolean isActive = true;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
