package com.job.dto.admin;

public class SystemStatisticsDto {
    private long totalJobSeekers;
    private long totalEmployers;
    private long totalJobs;
    private long totalApplications;
    private long pendingEmployers;
    private long flaggedJobSeekers;
    private long flaggedJobs;
    private long revokedUsers;

    public long getTotalJobSeekers() {
        return totalJobSeekers;
    }

    public void setTotalJobSeekers(long totalJobSeekers) {
        this.totalJobSeekers = totalJobSeekers;
    }

    public long getTotalEmployers() {
        return totalEmployers;
    }

    public void setTotalEmployers(long totalEmployers) {
        this.totalEmployers = totalEmployers;
    }

    public long getTotalJobs() {
        return totalJobs;
    }

    public void setTotalJobs(long totalJobs) {
        this.totalJobs = totalJobs;
    }

    public long getTotalApplications() {
        return totalApplications;
    }

    public void setTotalApplications(long totalApplications) {
        this.totalApplications = totalApplications;
    }

    public long getPendingEmployers() {
        return pendingEmployers;
    }

    public void setPendingEmployers(long pendingEmployers) {
        this.pendingEmployers = pendingEmployers;
    }

    public long getFlaggedJobSeekers() {
        return flaggedJobSeekers;
    }

    public void setFlaggedJobSeekers(long flaggedJobSeekers) {
        this.flaggedJobSeekers = flaggedJobSeekers;
    }

    public long getFlaggedJobs() {
        return flaggedJobs;
    }

    public void setFlaggedJobs(long flaggedJobs) {
        this.flaggedJobs = flaggedJobs;
    }

    public long getRevokedUsers() {
        return revokedUsers;
    }

    public void setRevokedUsers(long revokedUsers) {
        this.revokedUsers = revokedUsers;
    }
}
