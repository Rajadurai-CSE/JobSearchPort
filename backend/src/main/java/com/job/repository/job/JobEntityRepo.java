package com.job.repository.job;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.job.entity.job.JobEntity;

@Repository
public interface JobEntityRepo extends JpaRepository<JobEntity, Long> {

        List<JobEntity> findByDeletedFalse();

        Optional<JobEntity> findByJobIdAndEmployerProfile_UserId(
                        Long jobId,
                        Long userId);

        List<JobEntity> findAllByEmployerProfile_UserId(Long userId);

        List<JobEntity> findByEmployerProfile_UserIdAndDeletedFalse(Long userId);

}
