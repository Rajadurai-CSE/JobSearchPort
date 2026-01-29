package com.job.entity.job;

import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;
import com.job.entity.jobseeker.JobSeekerProfile;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "flagged_jobs")
public class FlaggedJobs {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long requestId;
	
	private Long jobId;
	
	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_seeker_id")
    private JobSeekerProfile jobSeeker;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
    private Status status = Status.PENDING;
	
	public enum Status {
        PENDING, DELETED, IGNORED
    }

	private String reason;

	@CreationTimestamp
	private LocalDateTime appliedAt;
	
	public Long getRequestId() {
		return requestId;	
	}
	public void setRequestId(Long requestId) {
		this.requestId = requestId;
	}
	
	public String getReason() {
		return reason;
	}
	public void setReason(String reason) {
		this.reason = reason;
	}
	public LocalDateTime getAppliedAt() {
		return appliedAt;
	}
	public void setAppliedAt(LocalDateTime appliedAt) {
		this.appliedAt = appliedAt;
	}

    public JobSeekerProfile getJobSeeker() {
        return jobSeeker;
    }

    public void setJobSeeker(JobSeekerProfile jobSeeker) {
        this.jobSeeker = jobSeeker;
    }
	public Status getStatus() {
		return status;
	}
	public void setStatus(Status status) {
		this.status = status;
	}
	public Long getJobId() {
		return jobId;
	}
	public void setJobId(Long jobId) {
		this.jobId = jobId;
	}
}