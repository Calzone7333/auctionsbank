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
@CrossOrigin(origins = { "http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174",
        "https://madrasauction.com" }, allowedHeaders = "*", methods = { RequestMethod.GET, RequestMethod.POST,
                RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS })
public class AuctionController {

    @Autowired
    private AuctionRepository auctionRepository;

    @Autowired
    private UserRepository userRepository;

    private void validateNotDirectBrowserRequest() {
        ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        HttpServletRequest request = attr.getRequest();

        String fetchMode = request.getHeader("Sec-Fetch-Mode");
        String acceptHeader = request.getHeader("Accept");

        // Browsers requesting the URL directly usually have Sec-Fetch-Mode: navigate
        // and Accept header containing text/html.
        // We only want to allow cors/same-origin fetches that expect json.
        boolean isDirectBrowser = "navigate".equalsIgnoreCase(fetchMode) ||
                (acceptHeader != null && acceptHeader.contains("text/html"));

        if (isDirectBrowser) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "Direct API access is not allowed. Please use the website.");
        }
    }

    private boolean isPremiumOrAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth instanceof AnonymousAuthenticationToken ||
                auth.getPrincipal().equals("anonymousUser")) {
            return false;
        }

        Object principal = auth.getPrincipal();
        if (principal instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) principal;
            return userRepository.findByEmail(userDetails.getUsername()).map(u -> {
                if (u.getRole() == User.Role.ADMIN)
                    return true;
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
        try {
            validateNotDirectBrowserRequest();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Access Denied: Direct browser access to API is prohibited.");
        }

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
        try {
            validateNotDirectBrowserRequest();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Access Denied: Direct browser access to API is prohibited.");
        }

        boolean fullAccess = isPremiumOrAdmin();
        return auctionRepository.findById(id)
                .map(a -> ResponseEntity.ok(maskAuction(a, fullAccess)))
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
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteAuction(@PathVariable Long id) {
        System.out.println("Delete request received for auction ID: " + id);
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        System.out.println("Request by user: " + userDetails.getUsername());
        return auctionRepository.findById(id).map(auction -> {
            // Check if the current user is the creator
            String creatorEmail = auction.getCreatedByEmail();
            if (creatorEmail != null && !creatorEmail.equals(userDetails.getUsername())) {
                return ResponseEntity.status(403).body("You can only delete auctions you created.");
            }

            // Perform Hard Delete (remove from database)
            auctionRepository.delete(auction);
            System.out.println("Auction ID " + id + " deleted from database.");
            return ResponseEntity.ok("Auction deleted successfully");
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
