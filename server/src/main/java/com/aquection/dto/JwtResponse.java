package com.aquection.dto;

import lombok.Data;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private Long id;
    private String email;
    private String role;
    private boolean isVerified;
    private boolean isEmailVerified;
}
