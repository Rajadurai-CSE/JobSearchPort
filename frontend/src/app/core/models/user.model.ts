// User and Admin Models

export interface UserDto {
    userId: number;
    email: string;
    name: string;
    role: string;
    status: string;
}

export interface DisplayEmployerProfile {
    userId: number;
    email: string;
    name: string;
    contactNo: string;
    employerVerificationUrl: string;
    company: Company;
    status: string;
}

export interface DisplayReportedJS {
    requestId: number;
    jobSeekerId: number;
    jobSeekerName: string;
    jobSeekerEmail: string;
    employerId: number;
    employerName: string;
    reason: string;
    actionTaken?: string;
    appliedAt: string;
    actionNote?: string; // Temporary field for input binding
}

export interface FlaggedJobDto {
    requestId: number;
    jobId: number;
    jobSeekerId: number;
    reason: string;
    status: string;
    appliedAt: string;
}

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

// Profile Models
export interface JSProfile {
    id: number;
    userId: number;
    email: string;
    name: string;
    dob: string;
    phoneNo: string;
    location: string;
    skills: string;
    experience: number;
    resumeUrl: string;
    certifications: string;
    certificationsUrl: string;
}

export interface JSProfileUpdateRequest {
    userId: number;
    name: string;
    dob?: string;
    phoneNo: string;
    location: string;
    skills: string;
    experience?: number;
    resumeUrl: string;
    certifications?: string;
    certificationsUrl?: string;
}

export interface EmployerProfile {
    userId: number;
    email: string;
    name: string;
    contactNo: string;
    employerVerificationUrl: string;
    companyId: number;
    company: CompanyDto;
}

export interface EmpProfileUpdateRequest {
    user_id: number;
    name: string;
    contactNo?: string;
    employerVerificationUrl?: string;
    companyId?: number;
    companyDetails?: CompanyDto;
}

export interface Company {
    companyId: number;
    companyName: string;
    companyURL?: string;
    companyDescription?: string;
}

export interface CompanyDto {
    companyName: string;
    companyURL?: string;
    companyDescription?: string;
}
