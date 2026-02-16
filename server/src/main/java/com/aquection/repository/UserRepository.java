package com.aquection.repository;

import com.aquection.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Boolean existsByEmail(String email);

    long count();

    java.util.List<User> findByRole(User.Role role);

    Optional<User> findByEmailVerificationToken(String token);
}
