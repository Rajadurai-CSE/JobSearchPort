package com.job.repository.employer;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.job.entity.employer.Company;

public interface CompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> findByCompanyNameIgnoreCase(String companyName);

    List<Company> findByCompanyNameContainingIgnoreCase(String query);
}
