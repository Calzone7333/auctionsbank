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
}
