package com.job.dto.job;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class JobCreateRequestDto {
    @NotNull
    private Long userId; // employerId in Job table

    @NotBlank
    private String title;

    @NotBlank
    private String description;

    private String location;
    private String requiredSkills;
    private String salaryRange;

    private Integer noOfVacancies;
    private Integer minimumExperience;
    private String employmentType;

    private LocalDateTime createdAt;
    private LocalDate applicationDeadline;

    // getters and setters
    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public String getLocation() {
        return location;
    }
    public void setLocation(String location) {
        this.location = location;
    }
    public String getRequiredSkills() {
        return requiredSkills;
    }
    public void setRequiredSkills(String requiredSkills) {
        this.requiredSkills = requiredSkills;
    }
    public String getSalaryRange() {
        return salaryRange;
    }
    public void setSalaryRange(String salaryRange) {
        this.salaryRange = salaryRange;
    }
    public Integer getNoOfVacancies() {
        return noOfVacancies;
    }
    public void setNoOfVacancies(Integer noOfVacancies) {
        this.noOfVacancies = noOfVacancies;
    }
    public Integer getMinimumExperience() {
        return minimumExperience;
    }
    public void setMinimumExperience(Integer minimumExperience) {
        this.minimumExperience = minimumExperience;
    }
    public String getEmploymentType() {
        return employmentType;
    }
    public void setEmploymentType(String employmentType) {
        this.employmentType = employmentType;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    } 
    public LocalDate getApplicationDeadline() {
        return applicationDeadline;
    }
    public void setApplicationDeadline(LocalDate applicationDeadline) {
        this.applicationDeadline = applicationDeadline;
    }

}

