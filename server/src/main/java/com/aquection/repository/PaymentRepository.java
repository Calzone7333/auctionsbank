package com.aquection.repository;

import com.aquection.entity.Payment;
import com.aquection.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByOrderId(String orderId);

    List<Payment> findByUserOrderByCreatedAtDesc(User user);
}
