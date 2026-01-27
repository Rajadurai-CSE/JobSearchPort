package com.job.repository.jobseeker;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.job.entity.jobseeker.BookMarkedJobs;

import java.util.List;

@Repository
public interface BookMarkedJobsRepo extends JpaRepository<BookMarkedJobs, Long> {
    List<BookMarkedJobs> findByJobSeekerId(Long jobSeekerId);
}
