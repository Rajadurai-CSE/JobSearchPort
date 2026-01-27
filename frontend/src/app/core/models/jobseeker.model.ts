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
    companyName?: string;
    applicantCount?: number;
}

export interface JobSearchRequest {
    location?: string;
    skills?: string;
    minExperience?: number;
    salaryRange?: string;
}

export interface Application {
    jobId: number;
    jobTitle: string;
    companyName: string;
    stage: 'APPLIED' | 'SHORTLISTED' | 'INTERVIEW' | 'REJECTED' | 'HIRED' | 'WITHDRAWN';
    description: string;
    appliedAt: string;
    updatedAt: string;
}

export interface Bookmark {
    bookmarkId: number;
    jobId: number;
    jobTitle: string;
    companyName: string;
    location: string;
    salaryRange: string;
    bookmarkedAt: string;
}

export interface FlaggedJobStatus {
    requestId: number;
    jobId: number;
    jobTitle: string;
    reason: string;
    appliedAt: string;
}

export interface JobSeekerProfile {
    userId: number;
    email: string;
    name: string;
    dob: string;
    location: string;
    phoneNo: string;
    skills: string;
    experience: number;
    resumeUrl: string;
    certifications: string;
    certificationsUrl: string;
}
