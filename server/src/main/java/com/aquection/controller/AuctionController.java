package com.aquection.controller;

import com.aquection.entity.Auction;
import com.aquection.repository.AuctionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.io.IOException;
import java.util.UUID;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/auctions")
@CrossOrigin(origins = { "http://localhost:5173", "https://madrasauction.com" }) // Allow frontend access
public class AuctionController {

    @Autowired
    private AuctionRepository auctionRepository;

    @GetMapping
    public List<Auction> getAllAuctions(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String bank) {
        if (city != null) {
            return auctionRepository.findByCityNameContainingIgnoreCase(city);
        }
        if (bank != null) {
            return auctionRepository.findByBankNameContainingIgnoreCase(bank);
        }
        return auctionRepository.findByIsActiveTrue();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Auction> getAuctionById(@PathVariable Long id) {
        return auctionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Auction> getMyAuctions() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return auctionRepository.findByCreatedByEmail(userDetails.getUsername());
    }

    @PostMapping("/upload")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Collections.singletonMap("error", "File is empty"));
            }

            String uploadDir = "uploads/";
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String fileName = UUID.randomUUID().toString() + "_"
                    + file.getOriginalFilename().replaceAll("[^a-zA-Z0-9.-]", "_");
            Path targetLocation = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation);

            String fileUrl = "/uploads/" + fileName;
            return ResponseEntity.ok(Collections.singletonMap("url", fileUrl));

        } catch (IOException ex) {
            ex.printStackTrace();
            return ResponseEntity.internalServerError().body(Collections.singletonMap("error", "Could not store file"));
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Auction createAuction(@RequestBody Auction auction) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        auction.setCreatedByEmail(userDetails.getUsername());
        return auctionRepository.save(auction);
    }

    @GetMapping("/public/stats")
    public ResponseEntity<?> getPublicStats() {
        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("totalActive", auctionRepository.countByIsActiveTrue());
        stats.put("typeCounts", auctionRepository.countActiveAuctionsByPropertyType());
        stats.put("banks", auctionRepository.findDistinctBankNames());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getStats() {
        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("totalAuctions", auctionRepository.count());
        return ResponseEntity.ok(stats);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateAuction(@PathVariable Long id, @RequestBody Auction updatedAuction) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return auctionRepository.findById(id).map(auction -> {
            if (!auction.getCreatedByEmail().equals(userDetails.getUsername())) {
                return ResponseEntity.status(403).body("You can only edit auctions you created.");
            }
            // Update fields
            auction.setTitle(updatedAuction.getTitle());
            auction.setDescription(updatedAuction.getDescription());
            auction.setBankName(updatedAuction.getBankName());
            auction.setCityName(updatedAuction.getCityName());
            auction.setPropertyType(updatedAuction.getPropertyType());
            auction.setReservePrice(updatedAuction.getReservePrice());
            auction.setEmdAmount(updatedAuction.getEmdAmount());
            auction.setAuctionDate(updatedAuction.getAuctionDate());
            auction.setNoticeUrl(updatedAuction.getNoticeUrl());
            auction.setBorrowerName(updatedAuction.getBorrowerName());
            auction.setLocation(updatedAuction.getLocation());
            auction.setLocality(updatedAuction.getLocality());
            auction.setArea(updatedAuction.getArea());
            auction.setBidIncrement(updatedAuction.getBidIncrement());
            auction.setEmdLastDate(updatedAuction.getEmdLastDate());
            auction.setAuctionEndDate(updatedAuction.getAuctionEndDate());
            auction.setInspectionDate(updatedAuction.getInspectionDate());
            auction.setBankContactDetails(updatedAuction.getBankContactDetails());
            auction.setPossession(updatedAuction.getPossession());

            Auction saved = auctionRepository.save(auction);
            return ResponseEntity.ok(saved);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
