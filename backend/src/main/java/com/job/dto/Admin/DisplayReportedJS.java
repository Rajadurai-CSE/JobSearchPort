package com.job.dto.admin;

import java.time.LocalDateTime;

public class DisplayReportedJS {

    private Long requestId;
    private Long jobSeekerId;
    private String jobSeekerName;
    private String jobSeekerEmail;
    private Long employerId;
    private String employerName;
    private String reason;
    private LocalDateTime appliedAt;
    private String actionTaken;

    public DisplayReportedJS(Long requestId, Long jobSeekerId, String jobSeekerName, String jobSeekerEmail,
            Long employerId, String employerName, String reason,
            LocalDateTime appliedAt, String actionTaken) {
        this.requestId = requestId;
        this.jobSeekerId = jobSeekerId;
        this.jobSeekerName = jobSeekerName;
        this.jobSeekerEmail = jobSeekerEmail;
        this.employerId = employerId;
        this.employerName = employerName;
        this.reason = reason;
        this.appliedAt = appliedAt;
        this.actionTaken = actionTaken;
    }

    public DisplayReportedJS() {
    }

    public Long getRequestId() {
        return requestId;
    }

    public void setRequestId(Long requestId) {
        this.requestId = requestId;
    }

    public Long getJobSeekerId() {
        return jobSeekerId;
    }

    public void setJobSeekerId(Long jobSeekerId) {
        this.jobSeekerId = jobSeekerId;
    }

    public String getJobSeekerName() {
        return jobSeekerName;
    }

    public void setJobSeekerName(String jobSeekerName) {
        this.jobSeekerName = jobSeekerName;
    }

    public String getJobSeekerEmail() {
        return jobSeekerEmail;
    }

    public void setJobSeekerEmail(String jobSeekerEmail) {
        this.jobSeekerEmail = jobSeekerEmail;
    }

    public Long getEmployerId() {
        return employerId;
    }

    public void setEmployerId(Long employerId) {
        this.employerId = employerId;
    }

    public String getEmployerName() {
        return employerName;
    }

    public void setEmployerName(String employerName) {
        this.employerName = employerName;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }

    public void setAppliedAt(LocalDateTime appliedAt) {
        this.appliedAt = appliedAt;
    }

    public String getActionTaken() {
        return actionTaken;
    }

    public void setActionTaken(String actionTaken) {
        this.actionTaken = actionTaken;
    }
}
