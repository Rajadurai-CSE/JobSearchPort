package com.job.dto.employer;

import jakarta.validation.constraints.NotBlank;


public class EmpProfileUpdateDto {

    @NotBlank
    private Long user_id;
    @NotBlank
    private String name;


    private String contactNo;
    private String employerVerificationUrl;

    private Long companyId;         // use this...
    private CompanyDto companyDetails; // ...or this to create a new company


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
    public CompanyDto getCompanyDetails() {
        return companyDetails;
    }
    public void setCompanyDetails(CompanyDto companyDetails) {
        this.companyDetails = companyDetails;
    }

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}


    /**
     * @return Long return the user_id
     */
    public Long getUser_id() {
        return user_id;
    }

    /**
     * @param user_id the user_id to set
     */
    public void setUser_id(Long user_id) {
        this.user_id = user_id;
    }

}



