package com.job.repository.employer;

import org.springframework.stereotype.Repository;

import com.job.entity.employer.EmployerProfile;

import org.springframework.data.jpa.repository.JpaRepository;
@Repository
public interface EmployerProfileRepo extends JpaRepository<EmployerProfile,Long> {
}
