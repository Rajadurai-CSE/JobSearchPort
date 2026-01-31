package com.job.service;

import java.time.LocalDate;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.job.dto.employer.CompanyDto;
import com.job.dto.employer.EmpProfileUpdateDto;
import com.job.dto.employer.EmployerDto;
import com.job.dto.employer.FlagUserRequestDto;
import com.job.mapper.EmployerMapper;
import com.job.dto.job.EmployerJobApplicationDto;
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

    @Transactional
    public EmployerDto updateProfile(EmpProfileUpdateDto req) {

        String name = req.getName().trim();
        EmployerProfile e = getEmployerById(req.getUser_id());
        Company company = resolveCompany(req);

        e.setName(name);
        e.setCompany(company);
        e.setContactNo(req.getContactNo());
        e.setEmployerVerificationUrl(req.getEmployerVerificationUrl());

        EmployerProfile saved = employerProfileRepo.save(e);
        return EmployerMapper.toEmployerDto(saved);
    }

    public EmployerDto getProfile(Long userId) {
        EmployerProfile employer = getEmployerById(userId);
        return EmployerMapper.toEmployerDto(employer);
    }

    private Company resolveCompany(EmpProfileUpdateDto req) {
        if (req.getCompanyId() != null) {
            return companyRepository.findById(req.getCompanyId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid companyId"));
        }
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

    public EmployerProfile getEmployerById(Long employerId) {
        return employerProfileRepo.findById(employerId)
                .orElseThrow(() -> new IllegalArgumentException("Employer not found with id: " + employerId));
    }

    public Company getCompanyById(Long companyId) {
        return companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Company not found with id: " + companyId));
    }

    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    public List<Company> searchCompanies(String query) {
        if (query == null || query.trim().isEmpty()) {
            return companyRepository.findAll();
        }
        return companyRepository.findByCompanyNameContainingIgnoreCase(query.trim());
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

        job.setDeadline(dto.getApplicationDeadline());

        if (job.getDeadline() != null && job.getDeadline().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("applicationDeadline cannot be before postedDate");
        }

        JobEntity saved = jobEntityRepository.save(job);
        return JobMapper.JobResponseDto(saved);
    }

    public JobEntity getJobByIdForEmployer(Long jobId, Long employerId) {
        return jobEntityRepository.findByJobIdAndEmployerProfile_UserId(jobId, employerId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found"));
    }

    public JobResponseDto getJobById(Long jobId, Long employerId) {
        JobEntity job = getJobByIdForEmployer(jobId, employerId);
        return JobMapper.JobResponseDto(job);
    }

    /**
     * Update job - only vacancies and deadline can be modified.
     * For other changes, employers must delete and create a new job.
     */
    @Transactional
    public JobResponseDto updateJob(Long jobId, Long userId, JobUpdateRequestDto req) {
        JobEntity existing = getJobByIdForEmployer(jobId, userId);

        // Update only vacancies and deadline
        if (req.getNoOfVacancies() != null && req.getNoOfVacancies() > 0) {
            existing.setVacancies(req.getNoOfVacancies());
        }

        if (req.getApplicationDeadline() != null) {
            // Validate deadline is not before creation date
            if (existing.getCreatedAt() != null &&
                    req.getApplicationDeadline().isBefore(existing.getCreatedAt().toLocalDate())) {
                throw new IllegalArgumentException("Application deadline cannot be before job creation date");
            }
            existing.setDeadline(req.getApplicationDeadline());
        }

        JobEntity saved = jobEntityRepository.save(existing);
        return JobMapper.JobResponseDto(saved);
    }

    public List<JobResponseDto> getAllJobs(Long userId) {
        List<JobEntity> jobs = jobEntityRepository.findByEmployerProfile_UserIdAndDeletedFalse(userId);

        return JobMapper.JobResponseDto(jobs);
    }

    public void deleteJob(Long jobId, Long userId) {
        JobEntity existing = getJobByIdForEmployer(jobId, userId);

        // Mark all applications as JOB_DELETED
        List<JobApplications> applications = jobApplicationRepo.findByJob_JobId(jobId);
        for (JobApplications app : applications) {
            app.setStage(com.job.enums.ApplicationStage.JOB_DELETED);
            app.setDescription("Job was deleted by employer");
            jobApplicationRepo.save(app);
        }

        // Soft delete - mark as deleted instead of removing
        existing.setDeleted(true);
        jobEntityRepository.save(existing);
    }

    public List<EmployerJobApplicationDto> getJobApplications(Long jobId, Long employerId) {
        jobEntityRepository.findByJobIdAndEmployerProfile_UserId(jobId, employerId)
                .orElseThrow(() -> new IllegalArgumentException("Job does not belong to employer"));

        List<JobApplications> applications = jobApplicationRepo.findByJobIdAndEmployerId(jobId, employerId);

        return applications.stream().map(app -> {
            EmployerJobApplicationDto dto = new EmployerJobApplicationDto();
            dto.setJobId(app.getJob().getJobId());
            dto.setJobSeekerId(app.getJobSeeker().getUserId());
            dto.setJobSeekerName(app.getJobSeeker().getName());
            dto.setJobSeekerEmail(app.getJobSeeker().getEmail());
            dto.setStage(app.getStage());
            dto.setAppliedAt(app.getAppliedAt());
            dto.setUpdatedAt(app.getUpdatedAt());
            dto.setNotes(app.getDescription());
            dto.setResumeUrl(app.getResumeUrl());
            return dto;
        }).toList();
    }

    public void flagUser(FlagUserRequestDto cur) {

        FlaggedJobSeekers entity = new FlaggedJobSeekers();

        EmployerProfile e = employerProfileRepo.findById(cur.getEmployerId())
                .orElseThrow(() -> new IllegalArgumentException("Employer not found with id: " + cur.getEmployerId()));
        entity.setEmployer(e);

        JobSeekerProfile j = jobSeekerProfileRepo.findById(cur.getJobseeker_id()).orElseThrow(
                () -> new IllegalArgumentException("Job Seeker not found with id: " + cur.getJobseeker_id()));
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
                cur.getUpdatedAt() != null ? cur.getUpdatedAt() : LocalDate.now());

        jobApplicationRepo.save(entity);
    }

    public List<com.job.dto.employer.FlaggedJobSeekerDto> getMyFlaggedJobSeekers(Long userId) {
        List<FlaggedJobSeekers> flags = flagJobSeekerRepo.findByEmployer_UserId(userId);
        return flags.stream().map(flag -> {
            com.job.dto.employer.FlaggedJobSeekerDto dto = new com.job.dto.employer.FlaggedJobSeekerDto();
            dto.setRequestId(flag.getRequest_id());
            dto.setJobSeekerId(flag.getJobSeeker().getUserId());
            dto.setJobSeekerName(flag.getJobSeeker().getName());
            dto.setJobSeekerEmail(flag.getJobSeeker().getEmail());
            dto.setReason(flag.getReason());
            dto.setActionTaken(flag.getAction_taken());
            dto.setFlaggedAt(flag.getAppliedAt());
            return dto;
        }).collect(java.util.stream.Collectors.toList());
    }

    private boolean hasText(String s) {
        return s != null && !s.trim().isEmpty();
    }

    private String trim(String s) {
        return s == null ? null : s.trim();
    }
}