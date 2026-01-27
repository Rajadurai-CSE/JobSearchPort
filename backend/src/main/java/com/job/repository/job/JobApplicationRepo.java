package com.job.repository.job;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.job.entity.job.JobApplicationId;
import com.job.entity.job.JobApplications;
import com.job.entity.job.JobEntity;
import com.job.entity.jobseeker.JobSeekerProfile;

public interface JobApplicationRepo extends JpaRepository<JobApplications, JobApplicationId> {

    List<JobApplications> findByJobSeeker(JobSeekerProfile jobSeeker);

    List<JobApplications> findByJob_JobId(Long jobId);
}
