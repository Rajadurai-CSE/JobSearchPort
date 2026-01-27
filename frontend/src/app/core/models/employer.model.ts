export interface EmployerProfile {
    userId: number;
    email: string;
    name: string;
    contactNo: string;
    employerVerificationUrl: string;
    companyDetails?: Company;
}

export interface Company {
    companyId?: number;
    companyName: string;
    companyURL: string;
    companyDescription: string;
}

export interface JobCreateRequest {
    userId: number;
    title: string;
    description: string;
    location: string;
    requiredSkills: string;
    salaryRange: string;
    noOfVacancies: number;
    minimumExperience: number;
    employmentType: string;
    applicationDeadline: string;
}

export interface Applicant {
    jobSeekerId: number;
    email: string;
    name: string;
    skills: string;
    experience: number;
    resumeUrl: string;
    stage: string;
    description: string;
    appliedAt: string;
}

export interface FlagUserRequest {
    employerId: number;
    jobseeker_id: number;
    reason: string;
}

export interface JobApplicationUpdate {
    jobId: number;
    jobSeekerId: number;
    stage: string;
    notes: string;
    updatedAt?: string;
}

export interface FlaggedJobSeekerStatus {
    requestId: number;
    jobSeekerId: number;
    jobSeekerEmail: string;
    reason: string;
    appliedAt: string;
    actionTaken: string;
}
