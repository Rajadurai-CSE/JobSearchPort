export interface SystemStatistics {
    totalJobSeekers: number;
    totalEmployers: number;
    totalJobs: number;
    totalApplications: number;
    pendingEmployers: number;
    flaggedJobSeekers: number;
    flaggedJobs: number;
    revokedUsers: number;
}

export interface UserDto {
    userId: number;
    email: string;
    role: string;
    status: string;
    name: string;
}

export interface FlaggedJob {
    requestId: number;
    jobId: number;
    jobSeekerId: number;
    reason: string;
    appliedAt: string;
    actionTaken: string;
}

export interface DisplayEmployerProfile {
    userId: number;
    email: string;
    name: string;
    companyName: string;
    contactNo: string;
    status: string;
}
