package com.job.dto.auth;

import com.job.enums.Approval_Status;
import com.job.enums.Role;

public class RegisterResponse {
	private Long userId;
	private String email;
	private String name;
	private Role role;
	private Approval_Status status;

	public RegisterResponse(Long userId, String email, String name, Role role, Approval_Status status) {
		this.userId = userId;
		this.email = email;
		this.name = name;
		this.role = role;
		this.status = status;
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

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
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
}