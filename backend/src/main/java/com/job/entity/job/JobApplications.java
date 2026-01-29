package com.job.entity.job;

import java.time.LocalDate;

import com.job.entity.jobseeker.JobSeekerProfile;
import com.job.enums.ApplicationStage;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
// import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "job_applications")
public class JobApplications {

	@EmbeddedId
	private JobApplicationId id;

	@Enumerated(EnumType.STRING)
	private ApplicationStage stage;

	private String description;
	private LocalDate appliedAt;
	private LocalDate updatedAt;

	@Column(name = "resume_url", length = 500)
	private String resumeUrl;

	@ManyToOne(fetch = FetchType.LAZY)
	@MapsId("jobId")
	@JoinColumn(name = "job_id")
	private JobEntity job;

	@ManyToOne(fetch = FetchType.LAZY)
	@MapsId("jobSeekerId")
	@JoinColumn(name = "job_seeker_id")
	private JobSeekerProfile jobSeeker;

	public ApplicationStage getStage() {
		return stage;
	}

	public void setStage(ApplicationStage stage) {
		this.stage = stage;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public LocalDate getAppliedAt() {
		return appliedAt;
	}

	public void setAppliedAt(LocalDate appliedAt) {
		this.appliedAt = appliedAt;
	}

	public LocalDate getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDate updatedAt) {
		this.updatedAt = updatedAt;
	}

	/**
	 * @return JobApplicationId return the id
	 */
	public JobApplicationId getId() {
		return id;
	}

	/**
	 * @param id the id to set
	 */
	public void setId(JobApplicationId id) {
		this.id = id;
	}

	/**
	 * @return JobEntity return the job
	 */
	public JobEntity getJob() {
		return job;
	}

	/**
	 * @param job the job to set
	 */
	public void setJob(JobEntity job) {
		this.job = job;
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

	public String getResumeUrl() {
		return resumeUrl;
	}

	public void setResumeUrl(String resumeUrl) {
		this.resumeUrl = resumeUrl;
	}

}
