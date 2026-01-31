package com.job.entity.job;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import com.job.entity.employer.Company;
import com.job.entity.employer.EmployerProfile;
import com.job.entity.jobseeker.BookMarkedJobs;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "jobs")
public class JobEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long jobId;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "employer_id")
	private EmployerProfile employerProfile;

	private String title;
	private String description;
	private String location;
	private String requiredSkills;
	private int minExperience;
	private String salaryRange;
	private String employmentType;
	private int vacancies;
	private LocalDate deadline;

	@CreationTimestamp
	private LocalDateTime createdAt;

	private boolean deleted = false; // Soft delete flag

	// @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, orphanRemoval = true)
	// private List<FlaggedJobs> flaggedJobs;

	@OneToMany(mappedBy = "job", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<JobApplications> jobApplications;

	@OneToMany(mappedBy = "job", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<BookMarkedJobs> bookMarkedJobs;

	// @OneToMany(mappedBy = "job",fetch=FetchType.LAZY)
	// private List<JobApplication> applications = new ArrayList<>();

	public Long getJobId() {
		return jobId;
	}

	public void setJobId(Long jobId) {
		this.jobId = jobId;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public String getRequiredSkills() {
		return requiredSkills;
	}

	public void setRequiredSkills(String requiredSkills) {
		this.requiredSkills = requiredSkills;
	}

	public int getMinExperience() {
		return minExperience;
	}

	public void setMinExperience(int minExperience) {
		this.minExperience = minExperience;
	}

	public String getSalaryRange() {
		return salaryRange;
	}

	public void setSalaryRange(String salaryRange) {
		this.salaryRange = salaryRange;
	}

	public String getEmploymentType() {
		return employmentType;
	}

	public void setEmploymentType(String employmentType) {
		this.employmentType = employmentType;
	}

	public int getVacancies() {
		return vacancies;
	}

	public void setVacancies(int vacancies) {
		this.vacancies = vacancies;
	}

	public LocalDate getDeadline() {
		return deadline;
	}

	public void setDeadline(LocalDate deadline) {
		this.deadline = deadline;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public boolean isDeleted() {
		return deleted;
	}

	public void setDeleted(boolean deleted) {
		this.deleted = deleted;
	}

	/**
	 * @return List<FlaggedJobs> return the flaggedJobs
	 */
	// public List<FlaggedJobs> getFlaggedJobs() {
	// return flaggedJobs;
	// }

	// /**
	// * @param flaggedJobs the flaggedJobs to set
	// */
	// public void setFlaggedJobs(List<FlaggedJobs> flaggedJobs) {
	// this.flaggedJobs = flaggedJobs;
	// }

	/**
	 * @return List<JobApplication> return the jobApplications
	 */
	public List<JobApplications> getJobApplications() {
		return jobApplications;
	}

	/**
	 * @param jobApplications the jobApplications to set
	 */
	public void setJobApplications(List<JobApplications> jobApplications) {
		this.jobApplications = jobApplications;
	}

	/**
	 * @return EmployerProfile return the employerProfile
	 */
	public EmployerProfile getEmployerProfile() {
		return employerProfile;
	}

	/**
	 * @param employerProfile the employerProfile to set
	 */
	public void setEmployerProfile(EmployerProfile employerProfile) {
		this.employerProfile = employerProfile;
	}

	/**
	 * @return List<BookMarkedJobs> return the bookMarkedJobs
	 */
	public List<BookMarkedJobs> getBookMarkedJobs() {
		return bookMarkedJobs;
	}

	/**
	 * @param bookMarkedJobs the bookMarkedJobs to set
	 */
	public void setBookMarkedJobs(List<BookMarkedJobs> bookMarkedJobs) {
		this.bookMarkedJobs = bookMarkedJobs;
	}

}
