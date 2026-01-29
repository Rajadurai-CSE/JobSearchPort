package com.job.dto.admin;

import com.job.dto.employer.CompanyDto;
import com.job.entity.employer.Company;
import com.job.enums.Approval_Status;

public class DisplayEmployerProfileDto {
      private Long userId;              
    private String email;
    private String name;
    private String contactNo;
    private String employerVerificationUrl;
    private Company company;
    private Approval_Status status;      

    /**
     * @return String return the email
     */
    public String getEmail() {
        return email;
    }

    /**
     * @param email the email to set
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * @return String return the name
     */
    public String getName() {
        return name;
    }

    /**
     * @param name the name to set
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * @return String return the contactNo
     */
    public String getContactNo() {
        return contactNo;
    }

    /**
     * @param contactNo the contactNo to set
     */
    public void setContactNo(String contactNo) {
        this.contactNo = contactNo;
    }

    /**
     * @return String return the employerVerificationUrl
     */
    public String getEmployerVerificationUrl() {
        return employerVerificationUrl;
    }

    /**
     * @param employerVerificationUrl the employerVerificationUrl to set
     */
    public void setEmployerVerificationUrl(String employerVerificationUrl) {
        this.employerVerificationUrl = employerVerificationUrl;
    }



    /**
     * @return Approval_Status return the status
     */
    public Approval_Status getStatus() {
        return status;
    }

    /**
     * @param status the status to set
     */
    public void setStatus(Approval_Status status) {
        this.status = status;
    }


    /**
     * @return Long return the userId
     */
    public Long getUserId() {
        return userId;
    }

    /**
     * @param userId the userId to set
     */
    public void setUserId(Long userId) {
        this.userId = userId;
    }


    /**
     * @return Company return the company
     */
    public Company getCompany() {
        return company;
    }

    /**
     * @param company the company to set
     */
    public void setCompany(Company company) {
        this.company = company;
    }

}
