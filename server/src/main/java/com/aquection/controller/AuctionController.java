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
import java.util.Optional;
import java.util.stream.Collectors;
import java.time.LocalDateTime;
import com.aquection.repository.UserRepository;
import com.aquection.entity.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/auctions")
public class AuctionController {

    @Autowired
    private AuctionRepository auctionRepository;

    @Autowired
    private UserRepository userRepository;

    private boolean isPremiumOrAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth instanceof AnonymousAuthenticationToken) {
            return false;
        }

        // 1. Trust mapping from authorities
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ADMIN") || a.getAuthority().equals("ROLE_ADMIN"));
        if (isAdmin) return true;

        Object principal = auth.getPrincipal();
        if (principal instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) principal;
            return userRepository.findByEmail(userDetails.getUsername().toLowerCase()).map(u -> {
                if (u.getRole() == User.Role.ADMIN) return true;
                if (u.getAccountType() == User.AccountType.PREMIUM &&
                        u.getPlanExpiryDate() != null &&
                        u.getPlanExpiryDate().isAfter(LocalDateTime.now())) {
                    return true;
                }
                return false;
            }).orElse(false);
        }
        return false;
    }

    private Auction maskAuction(Auction original, boolean fullAccess) {
        if (fullAccess)
            return original;

        Auction masked = new Auction();
        masked.setId(original.getId());
        masked.setTitle(original.getTitle());
        masked.setDescription(original.getDescription());
        masked.setBankName(original.getBankName());
        masked.setCityName(original.getCityName());
        masked.setPropertyType(original.getPropertyType());
        masked.setReservePrice(original.getReservePrice());
        masked.setEmdAmount(original.getEmdAmount());
        masked.setAuctionDate(original.getAuctionDate());
        masked.setAuctionEndDate(original.getAuctionEndDate());
        masked.setImageUrl(original.getImageUrl());
        masked.setLocality(original.getLocality());
        masked.setArea(original.getArea());
        masked.setBidIncrement(original.getBidIncrement());
        masked.setInspectionDate(original.getInspectionDate());
        masked.setEmdLastDate(original.getEmdLastDate());
        masked.setPossession(original.getPossession());
        masked.setActive(original.isActive());
        masked.setCreatedAt(original.getCreatedAt());
        masked.setUpdatedAt(original.getUpdatedAt());

        // Mask sensitive fields and description for ALL non-Premium/Admin users
        if (!fullAccess) {
            masked.setBorrowerName(null);
            masked.setLocation(null);
            masked.setBankContactDetails(null);
            masked.setNoticeUrl(null);
            masked.setContactOfficer(null);
            masked.setContactNumber(null);
            masked.setFacing(null);
            masked.setOwnership(null);
            masked.setCreatedByEmail(null);
            masked.setDescription("Detailed property info available only for PREMIUM members.");
        }

        return masked;
    }

    @GetMapping
    public ResponseEntity<?> getAllAuctions(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String bank) {
        
        List<Auction> auctions;
        if (city != null) {
            auctions = auctionRepository.findByCityNameContainingIgnoreCase(city);
        } else if (bank != null) {
            auctions = auctionRepository.findByBankNameContainingIgnoreCase(bank);
        } else {
            auctions = auctionRepository.findByIsActiveTrue();
        }

        boolean fullAccess = isPremiumOrAdmin();
        List<Auction> maskedAuctions = auctions.stream()
                .map(a -> maskAuction(a, fullAccess))
                .collect(Collectors.toList());
        return ResponseEntity.ok(maskedAuctions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAuctionById(@PathVariable Long id) {
        boolean fullAccess = isPremiumOrAdmin();
        return auctionRepository.findById(id)
                .map(a -> ResponseEntity.ok(maskAuction(a, fullAccess)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/debug-auth")
    public ResponseEntity<?> debugAuth() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        java.util.Map<String, Object> debug = new java.util.HashMap<>();
        debug.put("name", auth.getName());
        debug.put("authorities", auth.getAuthorities());
        debug.put("isAuthenticated", auth.isAuthenticated());
        debug.put("principal", auth.getPrincipal());
        return ResponseEntity.ok(debug);
    }

    @GetMapping("/my")
    public List<Auction> getMyAuctions() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return auctionRepository.findByCreatedByEmail(userDetails.getUsername());
    }

    @PostMapping("/upload")
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
    public ResponseEntity<?> createAuction(@RequestBody Auction auction) {
        System.out.println("DEBUG (CREATE): Checking authentication...");
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth instanceof AnonymousAuthenticationToken) {
            System.out.println("DEBUG (CREATE): Access Denied - User is null or anonymous");
            return ResponseEntity.status(401).body(Collections.singletonMap("error", "Unauthorized: User is null or anonymous"));
        }

        if (!isPremiumOrAdmin()) {
            System.out.println("DEBUG (CREATE): Access Denied for user " + auth.getName());
            return ResponseEntity.status(403).body(Collections.singletonMap("error", "Access Denied: You must be an Administrator. Current: " + auth.getAuthorities()));
        }
        
        try {
            Object principal = auth.getPrincipal();
            String email;
            if (principal instanceof UserDetails) {
                email = ((UserDetails) principal).getUsername();
            } else {
                email = principal.toString();
            }
            
            auction.setCreatedByEmail(email);
            Auction saved = auctionRepository.save(auction);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Collections.singletonMap("error", "Database/Server Error: " + e.getMessage()));
        }
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
    public ResponseEntity<?> getStats() {
        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("totalAuctions", auctionRepository.count());
        return ResponseEntity.ok(stats);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAuction(@PathVariable Long id, @RequestBody Auction updatedAuction) {
        return auctionRepository.findById(id).map(auction -> {
            // Update fields (admins can edit anything)
            auction.setTitle(updatedAuction.getTitle());
            auction.setDescription(updatedAuction.getDescription());
            auction.setBankName(updatedAuction.getBankName());
            auction.setCityName(updatedAuction.getCityName());
            auction.setPropertyType(updatedAuction.getPropertyType());
            auction.setReservePrice(updatedAuction.getReservePrice());
            auction.setEmdAmount(updatedAuction.getEmdAmount());
            auction.setAuctionDate(updatedAuction.getAuctionDate());
            auction.setNoticeUrl(updatedAuction.getNoticeUrl());
            auction.setImageUrl(updatedAuction.getImageUrl());
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

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAuction(@PathVariable Long id) {
        System.out.println("Delete request received for auction ID: " + id);
        return auctionRepository.findById(id).map(auction -> {
            // Perform Hard Delete (remove from database)
            auctionRepository.delete(auction);
            System.out.println("Auction ID " + id + " deleted from database.");
            return ResponseEntity.ok("Auction deleted successfully");
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
