package com.aquection.controller;

import com.aquection.entity.Auction;
import com.aquection.repository.AuctionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auctions")
@CrossOrigin(origins = "http://localhost:5173") // Allow frontend access
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
}
