package com.aquection.controller;

import com.aquection.entity.Auction;
import com.aquection.repository.AuctionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    // Admin only endpoint in future
    @PostMapping
    public Auction createAuction(@RequestBody Auction auction) {
        return auctionRepository.save(auction);
    }
}
