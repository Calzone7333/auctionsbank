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
@com.fasterxml.jackson.annotation.JsonInclude(com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL)
public class Auction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String bankName;

    @Column(columnDefinition = "TEXT")
    private String cityName;

    @Column(columnDefinition = "TEXT")
    private String propertyType; // Residential, Commercial, etc.

    private BigDecimal reservePrice;

    private BigDecimal emdAmount;

    private LocalDateTime auctionDate;

    private LocalDateTime auctionEndDate;

    @Column(columnDefinition = "TEXT")
    private String noticeUrl;
    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    // Detailed Fields
    @Column(columnDefinition = "TEXT")
    private String borrowerName;
    @Column(columnDefinition = "TEXT")
    private String location;
    @Column(columnDefinition = "TEXT")
    private String locality;
    @Column(columnDefinition = "TEXT")
    private String bankContactDetails;
    @Column(columnDefinition = "TEXT")
    private String area;
    @Column(columnDefinition = "TEXT")
    private String facing;
    @Column(columnDefinition = "TEXT")
    private String possession; // Physical, Symbolic
    @Column(columnDefinition = "TEXT")
    private String ownership; // Freehold, Leasehold
    @Column(columnDefinition = "TEXT")
    private String contactOfficer;
    @Column(columnDefinition = "TEXT")
    private String contactNumber;
    private BigDecimal bidIncrement;
    private LocalDateTime inspectionDate;
    private LocalDateTime emdLastDate;
    private String createdByEmail;
    private boolean isActive = true;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "auction_images", joinColumns = @JoinColumn(name = "auction_id"))
    @Column(name = "image_url", columnDefinition = "TEXT", length = 2000)
    private java.util.List<String> imageUrls = new java.util.ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "auction_notices", joinColumns = @JoinColumn(name = "auction_id"))
    @Column(name = "notice_url", columnDefinition = "TEXT", length = 2000)
    private java.util.List<String> noticeUrls = new java.util.ArrayList<>();

    @CreationTimestamp
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
