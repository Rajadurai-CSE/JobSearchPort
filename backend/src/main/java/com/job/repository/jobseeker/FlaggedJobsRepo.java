package com.job.repository.jobseeker;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.job.entity.job.FlaggedJobs;
import java.util.List;

@Repository
public interface FlaggedJobsRepo extends JpaRepository<FlaggedJobs, Long> {
    List<FlaggedJobs> findByJobSeeker_UserId(Long userId);
    List<FlaggedJobs> findByStatus(FlaggedJobs.Status status);
    List<FlaggedJobs> findByJobId(Long jobId);

}
