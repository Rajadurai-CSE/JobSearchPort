package com.job.service;



import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import com.job.dto.employer.CompanyDto;
import com.job.dto.employer.EmpProfileUpdateDto;
import com.job.dto.employer.EmployerDto;
import com.job.dto.employer.FlagUserRequestDto;
import com.job.mapper.EmployerMapper;
import com.job.dto.job.JobApplicationUpdateDto;
import com.job.dto.job.JobCreateRequestDto;
import com.job.dto.job.JobResponseDto;
import com.job.dto.job.JobUpdateRequestDto;
import com.job.entity.employer.Company;
import com.job.entity.employer.EmployerProfile;
import com.job.entity.employer.FlaggedJobSeekers;
import com.job.entity.job.JobApplicationId;
import com.job.entity.job.JobApplications;
import com.job.entity.job.JobEntity;
import com.job.entity.jobseeker.JobSeekerProfile;
import com.job.entity.registerentity.UserAuth;
import com.job.repository.employer.CompanyRepository;
import com.job.repository.employer.EmployerProfileRepo;
import com.job.repository.job.FlaggedJobSeekersRepo;
import com.job.repository.job.JobApplicationRepo;
import com.job.repository.job.JobEntityRepo;
import com.job.repository.jobseeker.JobSeekerProfileRepo;
import com.job.mapper.JobMapper;

import jakarta.transaction.Transactional;

@Service
public class EmployerService {


    @Autowired
    private FlaggedJobSeekersRepo flagJobSeekerRepo;

    @Autowired
    private JobApplicationRepo jobApplicationRepo;
    @Autowired
    private EmployerProfileRepo employerProfileRepo;

    @Autowired
    private JobEntityRepo jobEntityRepository;

    @Autowired
    private JobSeekerProfileRepo jobSeekerProfileRepo;

    @Autowired
    private CompanyRepository companyRepository;



    // ---------------- EMPLOYERS ----------------

    @Transactional
    public EmployerDto updateProfile(EmpProfileUpdateDto req) {
        
        String name = req.getName().trim();

        EmployerProfile e = getEmployerById(req.getUser_id());

        // 2) Resolve company (existing/new) from DTO
        Company company = resolveCompany(req);

        e.setName(name);
        e.setCompany(company);
        e.setContactNo(req.getContactNo());
        e.setEmployerVerificationUrl(req.getEmployerVerificationUrl());

        EmployerProfile saved = employerProfileRepo.save(e);

        return EmployerMapper.toEmployerDto(saved);
    }

    private Company resolveCompany(EmpProfileUpdateDto req) {
        // if (req.getCompanyId() != null) {
        //     return companyRepository.findById(req.getCompanyId())
        //             .orElseThrow(() -> new IllegalArgumentException("Invalid companyId"));
        // }
        if (req.getCompanyDetails() != null &&
            req.getCompanyDetails().getCompanyName() != null &&
            !req.getCompanyDetails().getCompanyName().trim().isEmpty()) {

            String companyName = req.getCompanyDetails().getCompanyName().trim();
            return companyRepository.findByCompanyNameIgnoreCase(companyName)
                    .orElseGet(() -> {
                        Company c = new Company();
                        c.setCompanyName(companyName);
                        c.setCompanyURL(trim(req.getCompanyDetails().getCompanyURL()));
                        c.setCompanyDescription(trim(req.getCompanyDetails().getCompanyDescription()));
                        return companyRepository.save(c);
                    });
        }
        throw new IllegalArgumentException("Provide either companyId or companyDetails with companyName");
    }

    // private Long generateUnique4DigitUserId() {
    //     int maxAttempts = 60;
    //     for (int i = 0; i < maxAttempts; i++) {
    //         long candidate = 1000 + random.nextLong(9000);
    //         if (!userAuthRepository.existsById(candidate)) {
    //             return candidate;
    //         }
    //     }
    //     throw new IllegalStateException("Unable to generate unique 4-digit userId. Please retry.");
    // }

    // public List<EmployerDto> getEmployers() {
    //     return employerProfileRepo.findAll()
    //             .stream()
    //             .map(this::toEmployerDto)
    //             .toList();
    // }


    public EmployerProfile getEmployerById(Long employerId) {
        return employerProfileRepo.findById(employerId)
                .orElseThrow(() -> new IllegalArgumentException("Employer not found with id: " + employerId));
    }


    public Company getCompanyById(Long companyId) {
        return companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Company not found with id: " + companyId));
    }

    @Transactional
    public Company updateCompanyFull(Long companyId, CompanyDto requestBody) {
        Company existing = getCompanyById(companyId);
        existing.setCompanyName(requestBody.getCompanyName());
        existing.setCompanyURL(trim(requestBody.getCompanyURL()));
        existing.setCompanyDescription(trim(requestBody.getCompanyDescription()));
        return companyRepository.save(existing);
    }

    @Transactional
    public Company updateCompanyPartial(Long companyId, CompanyDto requestBody) {
        Company existing = getCompanyById(companyId);
        if (hasText(requestBody.getCompanyName())) {
            existing.setCompanyName(requestBody.getCompanyName().trim());
        }
        if (requestBody.getCompanyURL() != null) {
            existing.setCompanyURL(trim(requestBody.getCompanyURL()));
        }
        if (requestBody.getCompanyDescription() != null) {
            existing.setCompanyDescription(trim(requestBody.getCompanyDescription()));
        }
        return companyRepository.save(existing);
    }

    public void deleteCompany(Long id) {
        Company existing = getCompanyById(id);
        companyRepository.delete(existing);
    }

    // ---------------- JOBS ----------------

    public JobResponseDto createJob(JobCreateRequestDto dto) {
        // basic validations
        if (dto.getUserId() == null) {
            throw new IllegalArgumentException("userId is required (Employer userId)");
        }
        if (!employerProfileRepo.existsById(dto.getUserId())) {
            throw new IllegalArgumentException("userId does not exist");
        }
        if (!hasText(dto.getTitle())) {
            throw new IllegalArgumentException("title is required");
        }
        if (!hasText(dto.getDescription())) {
            throw new IllegalArgumentException("description is required");
        }
        if (dto.getNoOfVacancies() != null && dto.getNoOfVacancies() < 0) {
            throw new IllegalArgumentException("noOfVacancies cannot be negative");
        }

        JobEntity job = new JobEntity();
        EmployerProfile emp = getEmployerById(dto.getUserId());
        job.setEmployerProfile(emp);
        job.setTitle(dto.getTitle().trim());
        job.setDescription(dto.getDescription().trim());
        job.setLocation(trim(dto.getLocation()));
        job.setRequiredSkills(trim(dto.getRequiredSkills()));
        job.setSalaryRange(trim(dto.getSalaryRange()));
        job.setVacancies(dto.getNoOfVacancies() == null ? 0 : dto.getNoOfVacancies());
        job.setMinExperience(dto.getMinimumExperience() == null ? 0 : dto.getMinimumExperience());
        job.setEmploymentType(trim(dto.getEmploymentType()));

        // job.setCreatedAt(dto.getCreatedAt() != null ? dto.getCreatedAt() : LocalDateTime.now());
        
        job.setDeadline(dto.getApplicationDeadline());


        if (job.getDeadline() != null && job.getDeadline().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("applicationDeadline cannot be before postedDate");
        }

        JobEntity saved = jobEntityRepository.save(job);
        return JobMapper.JobResponseDto(saved);
    }

    public JobEntity getJobByIdForEmployer(Long jobId, Long employerId) {
        return jobEntityRepository.findByJobIdAndEmployerProfile_UserId(jobId, employerId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found"));
    }

    @Transactional
    public JobResponseDto updateJobFull(Long jobId, Long userId, JobUpdateRequestDto req) {
        JobEntity existing = getJobByIdForEmployer(jobId, userId);

        if (!hasText(req.getTitle())) {
            throw new IllegalArgumentException("title is required");
        }
        if (!hasText(req.getDescription())) {
            throw new IllegalArgumentException("description is required");
        }

        existing.setTitle(req.getTitle().trim());
        existing.setDeadline(req.getApplicationDeadline());
        existing.setLocation(trim(req.getLocation()));
        existing.setRequiredSkills(trim(req.getRequiredSkills()));
        existing.setSalaryRange(trim(req.getSalaryRange()));
        if (req.getNoOfVacancies() != null) existing.setVacancies(req.getNoOfVacancies());
        if (req.getMinimumExperience() != null) existing.setMinExperience(req.getMinimumExperience());
        existing.setEmploymentType(trim(req.getEmploymentType()));

        if (existing.getDeadline() != null &&
            existing.getCreatedAt() != null &&
            existing.getDeadline().isBefore(existing.getCreatedAt())) {
            throw new IllegalArgumentException("applicationDeadline cannot be before postedDate");
        }

        JobEntity saved = jobEntityRepository.save(existing);
        return JobMapper.JobResponseDto(saved);
    }

    @Transactional
    public JobResponseDto updateJobPartial(Long jobId, Long userId, JobUpdateRequestDto req) {
        JobEntity existing = getJobByIdForEmployer(jobId, userId);

        if (hasText(req.getTitle())) existing.setTitle(req.getTitle().trim());
        if (req.getApplicationDeadline() != null) existing.setDeadline(req.getApplicationDeadline());
        if (hasText(req.getLocation())) existing.setLocation(req.getLocation().trim());
        if (hasText(req.getRequiredSkills())) existing.setRequiredSkills(req.getRequiredSkills().trim());
        if (hasText(req.getSalaryRange())) existing.setSalaryRange(req.getSalaryRange().trim());
        if (req.getNoOfVacancies() != null && req.getNoOfVacancies() >= 0) existing.setVacancies(req.getNoOfVacancies());
        if (hasText(req.getDescription())) existing.setDescription(req.getDescription().trim());
        if (req.getMinimumExperience() != null && req.getMinimumExperience() >= 0) existing.setMinExperience(req.getMinimumExperience());
        if (hasText(req.getEmploymentType())) existing.setEmploymentType(req.getEmploymentType().trim());

        if (existing.getDeadline() != null &&
            existing.getCreatedAt() != null &&
            existing.getDeadline().isBefore(existing.getCreatedAt())) {
            throw new IllegalArgumentException("applicationDeadline cannot be before postedDate");
        }

        JobEntity saved = jobEntityRepository.save(existing);
        return JobMapper.JobResponseDto(saved);
    }

    public List<JobEntity> getAllJobs(Long userId) {
        return jobEntityRepository.findAllByEmployerProfile_UserId(userId)
                .stream().toList();
    }

    public void deleteJob(Long jobId, Long userId) {
        JobEntity existing = getJobByIdForEmployer(jobId, userId);
        jobEntityRepository.delete(existing);
    }

    // ---------------- FLAG & APPLICATIONS ----------------

    public void flagUser(FlagUserRequestDto cur) {

        FlaggedJobSeekers entity = new FlaggedJobSeekers();

        EmployerProfile e = employerProfileRepo.findById(cur.getEmployerId()).orElseThrow(() -> new IllegalArgumentException("Employer not found with id: " + cur.getEmployerId()));
        entity.setEmployer(e);

        JobSeekerProfile j = jobSeekerProfileRepo.findById(cur.getJobseeker_id()).orElseThrow(() -> new IllegalArgumentException("Job Seeker not found with id: " + cur.getJobseeker_id()));
        entity.setJobSeeker(j);

        entity.setReason(cur.getReason());

        flagJobSeekerRepo.save(entity);
    }

    public void updateApplicant(JobApplicationUpdateDto cur) {

    JobApplicationId id = new JobApplicationId();
    id.setJobId(cur.getJobId());
    id.setJobSeekerId(cur.getJobSeekerId());

    JobApplications entity = jobApplicationRepo
            .findById(id)
            .orElseThrow(() -> new RuntimeException("Application not found"));

    entity.setStage(cur.getStage());
    entity.setDescription(cur.getNotes());
    entity.setUpdatedAt(
        cur.getUpdatedAt() != null ? cur.getUpdatedAt() : LocalDate.now()
    );

    jobApplicationRepo.save(entity);
    }

    // ---------------- HELPERS (manual mapping) ----------------




    private boolean hasText(String s) {
        return s != null && !s.trim().isEmpty();
    }

    private String trim(String s) {
        return s == null ? null : s.trim();
    }
}







