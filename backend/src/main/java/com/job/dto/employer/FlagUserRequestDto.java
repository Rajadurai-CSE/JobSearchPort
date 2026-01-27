package com.job.dto.employer;


import jakarta.validation.constraints.NotNull;

public class FlagUserRequestDto {
    @NotNull
    private Long jobseeker_id;

    @NotNull
    private Long employerId;

    private String reason;

    public Long getEmployerId() {
        return employerId;
    }
    public void setEmployerId(Long employerId) {
        this.employerId = employerId;
    }
    public String getReason() {
        return reason;
    }
    public void setReason(String reason) {
        this.reason = reason;
    }

    public Long getJobseeker_id() {
        return jobseeker_id;
    }

    public void setJobseeker_id(Long jobseeker_id) {
        this.jobseeker_id = jobseeker_id;
    }

}
