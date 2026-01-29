package com.job.dto.admin;

import java.time.LocalDateTime;

public class DisplayReportedJS {
   
    private Long request_id;
    private Long job_seeker_id;
    private Long employer_id;
    private String reason;
    private LocalDateTime appliedAt;
    private String action_taken;

    public DisplayReportedJS(Long request_id, Long job_seeker_id, Long employer_id, String reason, LocalDateTime appliedAt,String action_taken){
      this.request_id = request_id;
      this.job_seeker_id = job_seeker_id;
      this.employer_id = employer_id;
      this.reason = reason;
      this.appliedAt = appliedAt;
      this.action_taken = action_taken;
    }
    public DisplayReportedJS(){}
    public Long getRequest_id() {
        return request_id;
    }

    public void setRequest_id(Long request_id) {
        this.request_id = request_id;
    }

 
    public Long getJob_seeker_id() {
        return job_seeker_id;
    }


    public void setJob_seeker_id(Long job_seeker_id) {
        this.job_seeker_id = job_seeker_id;
    }


    public Long getEmployer_id() {
        return employer_id;
    }


    public void setEmployer_id(Long employer_id) {
        this.employer_id = employer_id;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public LocalDateTime getappliedAt() {
        return appliedAt;
    }
    public void setappliedAt(LocalDateTime appliedAt) {
        this.appliedAt = appliedAt;
    }

    /**
     * @return String return the action_taken
     */
    public String getAction_taken() {
        return action_taken;
    }

    /**
     * @param action_taken the action_taken to set
     */
    public void setAction_taken(String action_taken) {
        this.action_taken = action_taken;
    }
}
