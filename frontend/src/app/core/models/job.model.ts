// Job Models

export interface Job {
    jobId: number;
    userId: number;
    title: string;
    description: string;
    location: string;
    requiredSkills: string;
    salaryRange: string;
    noOfVacancies: number;
    minimumExperience: number;
    employmentType: string;
    createdAt: string;
    applicationDeadline: string;
}

export interface JobSearchRequest {
    title?: string;
    location?: string;
    minExperience?: number;
    maxExperience?: number;
    skills?: string;
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

export interface JobUpdateRequest {
    title?: string;
    description?: string;
    location?: string;
    requiredSkills?: string;
    salaryRange?: string;
    noOfVacancies?: number;
    minimumExperience?: number;
    employmentType?: string;
    applicationDeadline?: string;
}

// Application Models
export interface Application {
    applicationId: number;
    jobId: number;
    jobTitle: string;
    companyName: string;
    stage: string;
    appliedAt: string;
    description?: string; // Employer notes about recruitment stage
}

export interface Bookmark {
    bookmarkId: number;
    jobId: number;
    jobTitle: string;
    companyName: string;
    location: string;
    savedAt: string;
}

export interface FlaggedJobStatus {
    requestId: number;
    jobId: number;
    jobTitle: string;
    reason: string;
    status: string;
    appliedAt: string;
}

// Employer specific
export interface EmployerJobApplication {
    applicationId: number;
    jobId: number;
    jobSeekerId: number;
    jobSeekerName: string;
    jobSeekerEmail: string;
    stage: string;
    appliedAt: string;
    resumeUrl?: string;
}

export interface JobApplicationUpdate {
    jobId: number;
    jobSeekerId: number;
    stage: string;
    notes?: string;
}

export interface FlagUserRequest {
    employerId: number;
    jobseeker_id: number;
    reason: string;
}
