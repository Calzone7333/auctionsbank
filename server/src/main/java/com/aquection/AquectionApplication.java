package com.aquection;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = "com.aquection.entity")
@EnableJpaRepositories(basePackages = "com.aquection.repository")
public class AquectionApplication {

    public static void main(String[] args) {
        SpringApplication.run(AquectionApplication.class, args);
    }

}
