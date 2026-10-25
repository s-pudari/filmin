package com.filmin.auth.dto;

import java.time.Instant;

public class AuthUserResponse {
    private Long id;
    private String email;
    private String accountStatus;
    private Instant createdAt;

    public AuthUserResponse() {}

    public AuthUserResponse(Long id, String email, String accountStatus, Instant createdAt) {
        this.id = id;
        this.email = email;
        this.accountStatus = accountStatus;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAccountStatus() {
        return accountStatus;
    }

    public void setAccountStatus(String accountStatus) {
        this.accountStatus = accountStatus;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
