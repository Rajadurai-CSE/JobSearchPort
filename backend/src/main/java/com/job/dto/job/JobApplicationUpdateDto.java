package com.job.dto.job;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

import com.job.enums.ApplicationStage;

public class JobApplicationUpdateDto {
    @NotNull
    private Long jobId;

    @NotNull
    private Long jobSeekerId;

    @NotNull
    private ApplicationStage stage;   // e.g., APPLIED, SCREENING, REJECTED, HIRED

    private String notes;
    private LocalDate updatedAt; // optional; defaulted if null
    // getters and setters
    public Long getJobId() {
        return jobId;
    }
    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }
    public Long getJobSeekerId() {
        return jobSeekerId;
    }
    public void setJobSeekerId(Long jobSeekerId) {
        this.jobSeekerId = jobSeekerId;
    }
    public ApplicationStage getStage() {
        return stage;
    }
    public void setStage(ApplicationStage stage) {
        this.stage = stage;
    }
    public String getNotes() {
        return notes;
    }
    public void setNotes(String notes) {
        this.notes = notes;
    }
    public LocalDate getUpdatedAt() {
        return updatedAt;
    }
    public void setUpdatedAt(LocalDate updatedAt) {
        this.updatedAt = updatedAt;
    }
}

