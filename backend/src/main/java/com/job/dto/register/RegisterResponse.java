package com.job.dto.register;
import com.job.enums.Approval_Status;
import com.job.enums.Role;

public class RegisterResponse {
	private String email;
	private Role role;
  private Approval_Status status;

	public RegisterResponse(String email,Role role,Approval_Status status){
		this.email = email;
		this.role = role;
		this.status = status;

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

}