package com.job.entity.employer;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.job.entity.job.FlaggedJobs;
import com.job.entity.job.JobEntity;
import com.job.entity.registerentity.UserAuth;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(
        name = "employer"
)
public class EmployerProfile {

    @Id
    @Column(name = "user_id")
    private Long userId; // PK (shared with UserAuth.userId)

    @OneToOne(optional = false)
    @MapsId
    @JoinColumn(name = "user_id")
    private UserAuth userauth;


    @Column(name = "email", nullable = false, unique = true, length = 150)
    private String email;
    
    @Column(name = "name", length = 150)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    private Company company;

    @OneToMany(mappedBy = "employerProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<JobEntity> jobs;

    @OneToMany(mappedBy = "employer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FlaggedJobSeekers> flaggedJobSeekers;

    // @OneToMany(mappedBy = "jobSeeker", cascade = CascadeType.ALL, orphanRemoval = true)
    // private List<FlaggedJobs> flaggedJobs;

    @Column(name = "employer_verification_url", length = 500)
    private String employerVerificationUrl;

    @Column(name = "contact_no", length = 30)
    private String contactNo;

    @CreationTimestamp
    private LocalDateTime createdAt;


    // // @Transient
    // private Long companyId; // dropdown selected companyId

    // // @Transient
    // private Company companyDetails; // new company details if not selecting existing

    // Getters/Setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public UserAuth getUserAuth() { return userauth; }
    public void setUserAuth(UserAuth userAuth) { this.userauth = userAuth; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Company getCompany() { return company; }
    public void setCompany(Company company) { this.company = company; }

    public String getEmployerVerificationUrl() { return employerVerificationUrl; }
    public void setEmployerVerificationUrl(String employerVerificationUrl) { this.employerVerificationUrl = employerVerificationUrl; }

    public String getContactNo() { return contactNo; }
    public void setContactNo(String contactNo) { this.contactNo = contactNo; }

    public LocalDateTime getCreatedAt() { return createdAt; }


	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
    
    

    /**
     * @return List<JobEntity> return the jobs
     */
    public List<JobEntity> getJobs() {
        return jobs;
    }

    /**
     * @param jobs the jobs to set
     */
    public void setJobs(List<JobEntity> jobs) {
        this.jobs = jobs;
    }

    /**
     * @return List<FlagJobSeeker> return the flagJobSeekers
     */
    public List<FlaggedJobSeekers> getFlagJobSeekers() {
        return flaggedJobSeekers;
    }

    /**
     * @param flagJobSeekers the flagJobSeekers to set
     */
    public void setFlagJobSeekers(List<FlaggedJobSeekers> flagJobSeekers) {
        this.flaggedJobSeekers = flagJobSeekers;
    }

}

