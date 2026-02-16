package com.aquection.repository;

import com.aquection.entity.Auction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuctionRepository extends JpaRepository<Auction, Long> {
    List<Auction> findByIsActiveTrue();

    List<Auction> findByCityNameContainingIgnoreCase(String city);

    List<Auction> findByBankNameContainingIgnoreCase(String bank);

    List<Auction> findByCreatedByEmail(String email);

    long count();

    long countByPropertyType(String propertyType);

    long countByIsActiveTrue();

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT a.bankName FROM Auction a WHERE a.isActive = true")
    List<String> findDistinctBankNames();

    @org.springframework.data.jpa.repository.Query("SELECT a.propertyType, COUNT(a) FROM Auction a WHERE a.isActive = true GROUP BY a.propertyType")
    List<Object[]> countActiveAuctionsByPropertyType();
}
