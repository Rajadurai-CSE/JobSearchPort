package com.job.entity.employer;


import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import java.time.LocalDateTime;


import com.job.entity.jobseeker.JobSeekerProfile;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;

@Entity
@Table(name = "flagged_jobseekers")
public class FlaggedJobSeekers {
  
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long request_id;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_seeker_id")
    private JobSeekerProfile jobSeeker;
 
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employer_id")
    private EmployerProfile employer;

    @Column(nullable=false)
    private String reason;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime appliedAt;

    @ColumnDefault("'PENDING'")
    private String action_taken;



    public Long getRequest_id() {
        return request_id;
    }
    public void setRequest_id(Long request_id) {
        this.request_id = request_id;
    }

    public String getReason() {
        return reason;
    }


    public void setReason(String reason) {
        this.reason = reason;
    }


    public LocalDateTime getCreatedAt() {
        return appliedAt;
    }


    public void setCreatedAt(LocalDateTime appliedAt) {
        this.appliedAt = appliedAt;
    }


    public String getAction_taken() {
        return action_taken;
    }


    public void setAction_taken(String action_taken) {
        this.action_taken = action_taken;
    }


    /**
     * @return JobSeekerProfile return the jobSeeker
     */
    public JobSeekerProfile getJobSeeker() {
        return jobSeeker;
    }

    /**
     * @param jobSeeker the jobSeeker to set
     */
    public void setJobSeeker(JobSeekerProfile jobSeeker) {
        this.jobSeeker = jobSeeker;
    }

    /**
     * @return EmployerProfile return the employer
     */
    public EmployerProfile getEmployer() {
        return employer;
    }

    /**
     * @param employer the employer to set
     */
    public void setEmployer(EmployerProfile employer) {
        this.employer = employer;
    }

    /**
     * @return LocalDateTime return the appliedAt
     */
    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }

    /**
     * @param appliedAt the appliedAt to set
     */
    public void setAppliedAt(LocalDateTime appliedAt) {
        this.appliedAt = appliedAt;
    }

}

