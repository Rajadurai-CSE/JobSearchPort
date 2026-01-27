package com.job.entity.jobseeker;
import com.job.entity.employer.FlaggedJobSeekers;
import com.job.entity.job.FlaggedJobs;
import com.job.entity.job.JobApplications;
import com.job.entity.registerentity.UserAuth;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "job_seekers")
public class JobSeekerProfile {
	
	@Id
	@Column(name = "user_id")
	private Long userId;
	
	
  private String email;
	private String name;
	private String dob;
	private String location;
	private String phoneNo;
	private String skills;
	private int experience;
	private String resumeUrl;
	private String certifications;
	private String certificationsUrl;

	@CreationTimestamp
	private LocalDateTime createdAt;

	
	@OneToOne(fetch=FetchType.LAZY)
  @MapsId
  @JoinColumn(name = "user_id")
	private UserAuth userauth;
  

//	@OneToMany(mappedBy="jobSeeker",fetch=FetchType.LAZY)
//	private List<BookMarkedJob> bookMarks = new ArrayList<>();
	
	@OneToMany(mappedBy = "jobSeeker", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<FlaggedJobs> flaggedJobs;

	@OneToMany(mappedBy = "jobSeeker", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<JobApplications> jobApplications;

	@OneToMany(mappedBy = "jobSeeker", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<FlaggedJobSeekers> flagJobSeekers;

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

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDob() {
		return dob;
	}

	public void setDob(String dob) {
		this.dob = dob;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public String getPhoneNo() {
		return phoneNo;
	}

	public void setPhoneNo(String phoneNo) {
		this.phoneNo = phoneNo;
	}

	public String getSkills() {
		return skills;
	}

	public void setSkills(String skills) {
		this.skills = skills;
	}

	public int getExperience() {
		return experience;
	}

	public void setExperience(int experience) {
		this.experience = experience;
	}

	public String getResumeUrl() {
		return resumeUrl;
	}

	public void setResumeUrl(String resumeUrl) {
		this.resumeUrl = resumeUrl;
	}

	public String getCertifications() {
		return certifications;
	}

	public void setCertifications(String certifications) {
		this.certifications = certifications;
	}

	public String getCertificationsUrl() {
		return certificationsUrl;
	}

	public void setCertificationsUrl(String certificationsUrl) {
		this.certificationsUrl = certificationsUrl;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public UserAuth getUserAuth() {
		return userauth;
	}

	public void setUserAuth(UserAuth userAuth) {
		this.userauth = userAuth;
	}
	

    /**
     * @return UserAuth return the userauth
     */
    public UserAuth getUserauth() {
        return userauth;
    }

    /**
     * @param userauth the userauth to set
     */
    public void setUserauth(UserAuth userauth) {
        this.userauth = userauth;
    }

    /**
     * @return List<FlaggedJobs> return the flaggedJobs
     */
    public List<FlaggedJobs> getFlaggedJobs() {
        return flaggedJobs;
    }

    /**
     * @param flaggedJobs the flaggedJobs to set
     */
    public void setFlaggedJobs(List<FlaggedJobs> flaggedJobs) {
        this.flaggedJobs = flaggedJobs;
    }

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

}