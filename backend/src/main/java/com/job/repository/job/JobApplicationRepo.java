package com.job.repository.job;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import com.job.entity.job.JobApplicationId;
import com.job.entity.job.JobApplications;
import com.job.entity.jobseeker.JobSeekerProfile;

@Repository
public interface JobApplicationRepo extends JpaRepository<JobApplications, JobApplicationId> {
    List<JobApplications> findByJobSeeker(JobSeekerProfile jobSeeker);
    List<JobApplications> findByJob_JobId(Long jobId);

    @Query("""
        SELECT ja
        FROM JobApplications ja
        WHERE ja.job.jobId = :jobId
          AND ja.job.employerProfile.userId = :employerId
    """)
    List<JobApplications> findByJobIdAndEmployerId(
            Long jobId,
            Long employerId
    );
}