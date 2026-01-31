package com.job.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.job.dto.employer.CompanyDto;
import com.job.dto.employer.EmpProfileUpdateDto;
import com.job.dto.employer.EmployerDto;
import com.job.dto.employer.FlagUserRequestDto;
import com.job.dto.job.EmployerJobApplicationDto;
import com.job.dto.job.JobApplicationUpdateDto;
import com.job.dto.job.JobCreateRequestDto;
import com.job.dto.job.JobResponseDto;
import com.job.dto.job.JobUpdateRequestDto;
import com.job.entity.employer.Company;
import com.job.service.EmployerService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/employer")
public class EmployerController {
    @Autowired
    private EmployerService service;

    @PutMapping("/update_profile")
    public ResponseEntity<EmployerDto> updateProfile(@RequestBody EmpProfileUpdateDto empProfileUpdateDto) {
        EmployerDto res = service.updateProfile(empProfileUpdateDto);
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @GetMapping("/profile/{userId}")
    public ResponseEntity<EmployerDto> getProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(service.getProfile(userId));
    }

    @GetMapping("/companies/fetch/{id}")
    public ResponseEntity<Company> fetchCompanyData(@PathVariable Long id) {
        Company company = service.getCompanyById(id);
        return new ResponseEntity<>(company, HttpStatus.OK);
    }

    @GetMapping("/companies/all")
    public ResponseEntity<List<Company>> getAllCompanies() {
        List<Company> companies = service.getAllCompanies();
        return new ResponseEntity<>(companies, HttpStatus.OK);
    }

    @GetMapping("/companies/search")
    public ResponseEntity<List<Company>> searchCompanies(@RequestParam(required = false) String q) {
        List<Company> companies = service.searchCompanies(q);
        return new ResponseEntity<>(companies, HttpStatus.OK);
    }

    @PutMapping("/companies/update/{id}")
    public ResponseEntity<Company> updateCompany(@PathVariable("id") Long id, @RequestBody CompanyDto companyRequest) {
        Company updated = service.updateCompanyFull(id, companyRequest);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @PatchMapping("/companies/updatePartial/{id}")
    public ResponseEntity<Company> updateCompanyPartial(@PathVariable("id") Long id,
            @RequestBody CompanyDto companyRequest) {
        Company updated = service.updateCompanyPartial(id, companyRequest);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @DeleteMapping("/companies/delete/{id}")
    public ResponseEntity<String> deleteCompany(@PathVariable("id") Long id) {
        service.deleteCompany(id);
        return new ResponseEntity<>("Company deleted successfully", HttpStatus.OK);
    }

    @PostMapping("/jobs/create")
    public ResponseEntity<JobResponseDto> createJob(@Valid @RequestBody JobCreateRequestDto jobReq) {
        JobResponseDto saved = service.createJob(jobReq);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PutMapping("/jobs/update/{jobId}/{employerId}")
    public ResponseEntity<JobResponseDto> updateJobFull(@PathVariable("jobId") Long jobId,
            @PathVariable("employerId") Long employerId, @Valid @RequestBody JobUpdateRequestDto jobReq) {
        JobResponseDto updated = service.updateJobFull(jobId, employerId, jobReq);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @PatchMapping("/jobs/updatePartial/{jobId}/{employerId}")
    public ResponseEntity<JobResponseDto> updateJobPartial(@PathVariable("jobId") Long jobId,
            @PathVariable("employerId") Long employerId, @RequestBody JobUpdateRequestDto jobReq) {
        JobResponseDto updated = service.updateJobPartial(jobId, employerId, jobReq);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @GetMapping("/jobs/{employerId}")
    public ResponseEntity<List<JobResponseDto>> getAllJobs(@PathVariable("employerId") Long empId) {
        return ResponseEntity.ok(service.getAllJobs(empId));
    }

    @GetMapping("/job/{jobId}/{employerId}")
    public ResponseEntity<JobResponseDto> getJobById(@PathVariable("jobId") Long jobId,
            @PathVariable("employerId") Long employerId) {
        return ResponseEntity.ok(service.getJobById(jobId, employerId));
    }

    @DeleteMapping("/jobs/delete/{jobId}/{employerId}")
    public ResponseEntity<String> deleteJob(@PathVariable("jobId") Long jobId,
            @PathVariable("employerId") Long employerId) {
        service.deleteJob(jobId, employerId);
        return new ResponseEntity<>("deleted successfully", HttpStatus.OK);
    }

    @PostMapping("/jobs/flagUser")
    public ResponseEntity<String> flagUser(@Valid @RequestBody FlagUserRequestDto cur) {
        service.flagUser(cur);
        return new ResponseEntity<>(
                "User with id " + cur.getJobseeker_id() + " is flagged by the employer " + cur.getEmployerId(),
                HttpStatus.OK);
    }

    @PutMapping("/jobs/updateApplicant")
    public ResponseEntity<String> updateApplicant(@Valid @RequestBody JobApplicationUpdateDto cur) {
        service.updateApplicant(cur);
        return new ResponseEntity<>("User with " + cur.getJobSeekerId() + "'s status is updated to " + cur.getStage(),
                HttpStatus.OK);
    }

    @GetMapping("/jobs/{jobId}/{employerId}/applications")
    public ResponseEntity<List<EmployerJobApplicationDto>> getJobApplications(
            @PathVariable Long jobId,
            @PathVariable Long employerId) {
        List<EmployerJobApplicationDto> res = service.getJobApplications(jobId, employerId);
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @GetMapping("/flag-requests/{employerId}")
    public ResponseEntity<List<com.job.dto.employer.FlaggedJobSeekerDto>> getMyFlagRequests(
            @PathVariable Long employerId) {
        return ResponseEntity.ok(service.getMyFlaggedJobSeekers(employerId));
    }
}