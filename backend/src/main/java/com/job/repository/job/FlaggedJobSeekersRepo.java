package com.job.repository.job;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.job.entity.employer.FlaggedJobSeekers;
import java.util.List;

@Repository
public interface FlaggedJobSeekersRepo extends JpaRepository<FlaggedJobSeekers, Long> {
    List<FlaggedJobSeekers> findByEmployer_UserId(Long userId);
}
