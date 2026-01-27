package com.job.entity.registerentity;
import com.job.entity.employer.EmployerProfile;
import com.job.entity.jobseeker.JobSeekerProfile;
import com.job.enums.Approval_Status;
import com.job.enums.Role;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;


@Entity
@Table(name = "users")
public class UserAuth {
	@Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_seq")
    @SequenceGenerator(
        name = "user_seq",
        sequenceName = "user_sequence",
        initialValue = 10001,
        allocationSize = 1
    )
    private Long userid;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Enumerated(EnumType.STRING)
    private Approval_Status status;
    
    // @OneToOne(mappedBy="User", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    // private Employer employer;

    @OneToOne(mappedBy="userauth", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private JobSeekerProfile jobseeker;

		@OneToOne(mappedBy="userauth", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private EmployerProfile employerProfile;



	public Long getUserid() {
		return userid;
	}

	public void setUserid(Long userid) {
		this.userid = userid;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	public Approval_Status getStatus() {
		return status;
	}

	public void setStatus(Approval_Status status) {
		this.status = status;
	}

    /**
     * @return JobSeekerProfile return the jobseeker
     */
    public JobSeekerProfile getJobseeker() {
        return jobseeker;
    }

    /**
     * @param jobseeker the jobseeker to set
     */
    public void setJobseeker(JobSeekerProfile jobseeker) {
        this.jobseeker = jobseeker;
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

}