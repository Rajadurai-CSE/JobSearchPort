package com.job.repository.jobseeker;

import org.springframework.stereotype.Repository;

import com.job.entity.jobseeker.JobSeekerProfile;
import com.job.entity.registerentity.UserAuth;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

@Repository
public interface JobSeekerProfileRepo extends JpaRepository<JobSeekerProfile,Long> {
}
