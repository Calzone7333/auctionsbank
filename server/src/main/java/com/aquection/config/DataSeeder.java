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
                Auction a1 = new Auction(null, "3 BHK Luxury Apartment in South Delhi",
                        "Premium residential property with modern amenities, 24/7 security, and dedicated parking space. Located in a prime residential hub.",
                        "State Bank of India", "New Delhi", "Residential", new BigDecimal("12500000"),
                        new BigDecimal("1250000"),
                        LocalDateTime.now().plusDays(15), "https://example.com/notices/1", true, null, null);

                Auction a2 = new Auction(null, "Commercial Showroom in Gachibowli",
                        "Spacious commercial unit suitable for retail or office space. High footfall area with excellent connectivity to the IT corridor.",
                        "HDFC Bank", "Hyderabad", "Commercial", new BigDecimal("28000000"), new BigDecimal("2800000"),
                        LocalDateTime.now().plusDays(20), "https://example.com/notices/2", true, null, null);

                Auction a3 = new Auction(null, "Industrial Plot in MIDC Area",
                        "Large industrial plot with existing shed and power connection. Ideal for small to medium scale manufacturing units.",
                        "ICICI Bank", "Pune", "Industrial", new BigDecimal("45000000"), new BigDecimal("4500000"),
                        LocalDateTime.now().plusDays(30), "https://example.com/notices/3", true, null, null);

                Auction a4 = new Auction(null, "2 BHK Apartment in Whitefield",
                        "Well-maintained apartment in a gated community. Close to major IT parks and shopping centers.",
                        "Axis Bank", "Bangalore", "Residential", new BigDecimal("6500000"), new BigDecimal("650000"),
                        LocalDateTime.now().plusDays(10), "https://example.com/notices/4", true, null, null);

                Auction a5 = new Auction(null, "Independent House in Anna Nagar",
                        "Spacious independent bungalow with a small garden. Located in a quiet and premium residential neighborhood.",
                        "Punjab National Bank", "Chennai", "Residential", new BigDecimal("18500000"),
                        new BigDecimal("1850000"),
                        LocalDateTime.now().plusDays(25), "https://example.com/notices/5", true, null, null);

                repository.saveAll(Arrays.asList(a1, a2, a3, a4, a5));
                System.out.println("Database seeded with initial auction data.");
            }
        };
    }
}
