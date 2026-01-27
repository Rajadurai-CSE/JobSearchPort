package com.job.entity.job;

import jakarta.persistence.Embeddable;

@Embeddable
public class JobApplicationId {
	private Long jobId;
	private Long jobSeekerId;
	public Long getJobId() {
		return jobId;
	}
	public void setJobId(Long jobId) {
		this.jobId = jobId;
	}
	public Long getJobSeekerId() {
		return jobSeekerId;
	}
	public void setJobSeekerId(Long jobSeekerId) {
		this.jobSeekerId = jobSeekerId;
	}
	
	
}
