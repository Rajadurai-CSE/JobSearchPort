package com.job.dto.auth;

import com.job.enums.Approval_Status;
import com.job.enums.Role;

public class LoginResponse {
    private String token;
    private Long userId;
    private String email;
    private Role role;
    private Approval_Status status;
    private String message;

    public LoginResponse() {
    }

    public LoginResponse(String token, Long userId, String email, Role role, Approval_Status status) {
        this.token = token;
        this.userId = userId;
        this.email = email;
        this.role = role;
        this.status = status;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Approval_Status getStatus() {
        return status;
    }

    public void setStatus(Approval_Status status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
