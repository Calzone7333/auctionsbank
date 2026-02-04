package com.aquection.config;

import com.aquection.entity.Auction;
import com.aquection.repository.AuctionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(AuctionRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                Auction a1 = new Auction(null, "Luxury 3BHK Apartment in Bandra", "Sea facing, 1500 sqft, 10th floor.",
                        "SBI", "Mumbai", "Residential", new BigDecimal("25000000"), new BigDecimal("2500000"),
                        LocalDateTime.now().plusDays(10), "http://example.com/notice1", true, null, null);
                Auction a2 = new Auction(null, "Commercial Shop in Koramangala", "Ground floor, main road facing.",
                        "HDFC", "Bangalore", "Commercial", new BigDecimal("8500000"), new BigDecimal("850000"),
                        LocalDateTime.now().plusDays(15), "http://example.com/notice2", true, null, null);
                Auction a3 = new Auction(null, "Industrial Plot in Peenya", "5000 sqft industrial land.", "Canara Bank",
                        "Bangalore", "Land", new BigDecimal("12000000"), new BigDecimal("1200000"),
                        LocalDateTime.now().plusDays(20), "http://example.com/notice3", true, null, null);

                repository.saveAll(Arrays.asList(a1, a2, a3));
                System.out.println("Database seeded with initial auctions.");
            }
        };
    }
}
