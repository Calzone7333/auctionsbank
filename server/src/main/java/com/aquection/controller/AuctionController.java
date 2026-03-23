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

    private void validateNotDirectBrowserRequest() {
        ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        if (attr == null)
            return;
        HttpServletRequest request = attr.getRequest();

        // Only restrict GET requests. POST/PUT/DELETE are always legitimate API calls
        // from code.
        if ("GET".equalsIgnoreCase(request.getMethod())) {
            String acceptHeader = request.getHeader("Accept");
            String fetchMode = request.getHeader("Sec-Fetch-Mode");

            // Browsers navigating directly send "navigate" fetch mode or expect "text/html"
            boolean isBrowserNavigation = "navigate".equalsIgnoreCase(fetchMode) ||
                    (acceptHeader != null && acceptHeader.contains("text/html"));

            if (isBrowserNavigation) {
                throw new org.springframework.security.access.AccessDeniedException(
                        "Direct API access via browser is prohibited for security reasons.");
            }
        }
    }

    private boolean isPremiumOrAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth instanceof AnonymousAuthenticationToken) {
            return false;
        }

        // 1. Check authorities from current Session/Token
        boolean hasAdminAuthority = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ADMIN") || a.getAuthority().equals("ROLE_ADMIN"));

        // 2. Direct Database Fallback (handles SQL updates without logout)
        Object principal = auth.getPrincipal();
        String email = (principal instanceof UserDetails) ? ((UserDetails) principal).getUsername()
                : principal.toString();

        // Case-insensitive database check
        boolean isAuthorized = userRepository.findByEmail(email.trim().toLowerCase()).map(u -> {
            boolean isAdmin = u.getRole() == User.Role.ADMIN;
            boolean isPremium = u.getAccountType() == User.AccountType.PREMIUM &&
                    u.getPlanExpiryDate() != null &&
                    u.getPlanExpiryDate().isAfter(LocalDateTime.now());

            System.out.println("DEBUG: Authenticated Email: [" + email + "] | DB Role: [" + u.getRole()
                    + "] | isAdmin: " + isAdmin);
            return isAdmin || isPremium;
        }).orElse(hasAdminAuthority);

        if (isAuthorized) {
            System.out.println("DEBUG: ACCESS GRANTED for user: " + email);
        } else {
            System.out.println("DEBUG: ACCESS MASKED for user: " + email + ". (Not Admin or Premium)");
        }

        return isAuthorized;
    }

    private Auction maskAuction(Auction original, boolean fullAccess) {
        // Get current user email for Owner-Override check
        String currentEmail = "";
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !(auth instanceof AnonymousAuthenticationToken)) {
            Object principal = auth.getPrincipal();
            currentEmail = (principal instanceof UserDetails) ? ((UserDetails) principal).getUsername()
                    : principal.toString();
            currentEmail = currentEmail.trim().toLowerCase();
        }

        // 1. If Admin/Premium, return full data
        // 2. NEW: If the user is the OWNER of this auction, return full data
        boolean isOwner = original.getCreatedByEmail() != null
                && original.getCreatedByEmail().trim().toLowerCase().equals(currentEmail);

        if (fullAccess || isOwner) {
            if (isOwner && !fullAccess) {
                System.out.println("DEBUG: User " + currentEmail + " is the OWNER of Auction " + original.getId()
                        + ". Granting full access.");
            }
            return original;
        }

        // If not authorized, create a copy with sensitive data removed
        Auction masked = new Auction();
        masked.setId(original.getId());
        masked.setTitle(original.getTitle());
        masked.setBankName(original.getBankName());
        masked.setCityName(original.getCityName());
        masked.setPropertyType(original.getPropertyType());
        masked.setReservePrice(original.getReservePrice());
        masked.setEmdAmount(original.getEmdAmount());
        masked.setAuctionDate(original.getAuctionDate());
        masked.setAuctionEndDate(original.getAuctionEndDate());
        masked.setImageUrl(original.getImageUrl());
        masked.setImageUrls(original.getImageUrls());
        masked.setArea(original.getArea());
        masked.setBidIncrement(original.getBidIncrement());
        masked.setInspectionDate(original.getInspectionDate());
        masked.setEmdLastDate(original.getEmdLastDate());
        masked.setPossession(original.getPossession());
        masked.setActive(original.isActive());
        masked.setCreatedAt(original.getCreatedAt());
        masked.setUpdatedAt(original.getUpdatedAt());

        // Mask sensitive fields
        masked.setBorrowerName(null);
        masked.setLocation(null);
        masked.setLocality(null);
        masked.setBankContactDetails(null);
        masked.setNoticeUrl(null);
        masked.setNoticeUrls(null);
        masked.setContactOfficer(null);
        masked.setContactNumber(null);
        masked.setFacing(null);
        masked.setOwnership(null);
        masked.setCreatedByEmail(null);
        masked.setDescription("Detailed property info available only for PREMIUM members.");

        return masked;
    }

    // ─── ADMIN-ONLY: Full unmasked data endpoints ──────────────────────
    // These endpoints are used exclusively by the AdminDashboard and always
    // return 100% unmasked data. Protected by an explicit ADMIN DB check.

    private boolean isAdminFromDB() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth instanceof AnonymousAuthenticationToken)
            return false;
        Object principal = auth.getPrincipal();
        String email = (principal instanceof UserDetails) ? ((UserDetails) principal).getUsername()
                : principal.toString();
        return userRepository.findByEmail(email).map(u -> u.getRole() == User.Role.ADMIN).orElse(false);
    }

    @GetMapping("/admin/all")
    public ResponseEntity<?> getAllAuctionsAdmin() {
        if (!isAdminFromDB()) {
            return ResponseEntity.status(403).body(Collections.singletonMap("error", "Access denied. Admin only."));
        }
        List<Auction> auctions = auctionRepository.findAll();
        auctions.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));
        return ResponseEntity.ok(auctions);
    }

    @GetMapping("/admin/{id}")
    public ResponseEntity<?> getAuctionByIdAdmin(@PathVariable Long id) {
        if (!isAdminFromDB()) {
            return ResponseEntity.status(403).body(Collections.singletonMap("error", "Access denied. Admin only."));
        }
        return auctionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    // ───────────────────────────────────────────────────────────────────

    @GetMapping
    public ResponseEntity<?> getAllAuctions(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String bank) {
        validateNotDirectBrowserRequest();

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
        validateNotDirectBrowserRequest();
        boolean fullAccess = isPremiumOrAdmin();
        return auctionRepository.findById(id)
                .map(a -> {
                    System.out.println("DEBUG: Data from Database for ID " + id + ": BorrowerName="
                            + a.getBorrowerName() + ", Location=" + a.getLocation() + ", Locality=" + a.getLocality()
                            + ", BankContactDetails=" + a.getBankContactDetails() + ", NoticeUrl=" + a.getNoticeUrl());
                    Auction result = maskAuction(a, fullAccess);
                    System.out.println("DEBUG: Sending Auction ID [" + id + "] to frontend. Masked? " + (!fullAccess));
                    return ResponseEntity.ok(result);
                })
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
        try {
            System.out.println("DEBUG (CREATE): Processing new auction POST...");
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();

            if (auth == null || !auth.isAuthenticated() || auth instanceof AnonymousAuthenticationToken) {
                System.out.println("DEBUG (CREATE): User is NULL or Anonymous");
                return ResponseEntity.status(401)
                        .body(Collections.singletonMap("error", "Unauthorized: User is null or anonymous"));
            }

            if (!isPremiumOrAdmin()) {
                System.out.println("DEBUG (CREATE): Access Denied for user " + auth.getName());
                return ResponseEntity.status(403).body(
                        Collections.singletonMap("error", "Access Denied: Admin role required for " + auth.getName()));
            }

            Object principal = auth.getPrincipal();
            String email = (principal instanceof UserDetails) ? ((UserDetails) principal).getUsername()
                    : principal.toString();

            System.out.println("DEBUG (CREATE): Saving auction for email: " + email);
            auction.setCreatedByEmail(email);
            Auction saved = auctionRepository.save(auction);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            System.err.println("FATAL ERROR in createAuction: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(Collections.singletonMap("error", "System Error: " + e.getMessage()));
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
            auction.setImageUrls(updatedAuction.getImageUrls());
            auction.setNoticeUrls(updatedAuction.getNoticeUrls());

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
