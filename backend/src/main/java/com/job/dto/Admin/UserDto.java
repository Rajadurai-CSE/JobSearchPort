package com.job.dto.admin;

import com.job.enums.Approval_Status;
import com.job.enums.Role;

public class UserDto {
    private Long userId;
    private String email;
    private Role role;
    private Approval_Status status;
    private String name;

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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
