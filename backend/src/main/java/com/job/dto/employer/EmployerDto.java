package com.job.dto.employer;


public class EmployerDto {
    private Long userId;                 // 4-digit id from UserAuth/Employer
    private String email;
    private String name;
    private String contactNo;
    private String employerVerificationUrl;

    private Long companyId;
    private CompanyDto company;             // optional enriched company info
    // getters and setters
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

    public String getContactNo() {
        return contactNo;
    }
    public void setContactNo(String contactNo) {
        this.contactNo = contactNo;
    }

    public String getEmployerVerificationUrl() {
        return employerVerificationUrl;
    }
    public void setEmployerVerificationUrl(String employerVerificationUrl) {
        this.employerVerificationUrl = employerVerificationUrl;
    }
    public Long getCompanyId() {
        return companyId;
    }
    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }
    public CompanyDto getCompany() {
        return company;
    }
    public void setCompany(CompanyDto company) {
        this.company = company;
    }
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}

}
