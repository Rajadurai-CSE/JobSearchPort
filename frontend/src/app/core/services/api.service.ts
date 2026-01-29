import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
    Job, JobSearchRequest, JobCreateRequest, JobUpdateRequest,
    Application, Bookmark, FlaggedJobStatus,
    EmployerJobApplication, JobApplicationUpdate, FlagUserRequest
} from '../models/job.model';
import {
    UserDto, DisplayEmployerProfile, DisplayReportedJS, FlaggedJobDto,
    SystemStatistics, JSProfile, JSProfileUpdateRequest,
    EmployerProfile, EmpProfileUpdateRequest, Company, CompanyDto
} from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private readonly API_URL = 'http://localhost:8080';

    constructor(private http: HttpClient) { }

    // ============== JOB SEEKER ENDPOINTS ==============

    // Profile
    getJSProfile(userId: number): Observable<JSProfile> {
        return this.http.get<JSProfile>(`${this.API_URL}/jobseeker/profile/${userId}`);
    }

    updateJSProfile(request: JSProfileUpdateRequest): Observable<JSProfile> {
        return this.http.put<JSProfile>(`${this.API_URL}/jobseeker/update_profile`, request);
    }

    // Jobs
    getAllJobs(): Observable<Job[]> {
        return this.http.get<Job[]>(`${this.API_URL}/jobseeker/jobs`);
    }

    getJobDetails(jobId: number): Observable<Job> {
        return this.http.get<Job>(`${this.API_URL}/jobseeker/jobs/${jobId}`);
    }

    searchJobs(request: JobSearchRequest): Observable<Job[]> {
        return this.http.post<Job[]>(`${this.API_URL}/jobseeker/jobs/search`, request);
    }

    // Applications
    applyForJob(jobId: number, jobSeekerId: number, resumeUrl: string): Observable<string> {
        const body = { jobId, jobSeekerId, resumeUrl };
        return this.http.post(`${this.API_URL}/jobseeker/apply`, body, { responseType: 'text' });
    }

    getApplications(seekerId: number): Observable<Application[]> {
        return this.http.get<Application[]>(`${this.API_URL}/jobseeker/applications/${seekerId}`);
    }

    withdrawApplication(jobId: number, seekerId: number): Observable<string> {
        return this.http.put(`${this.API_URL}/jobseeker/${jobId}/withdraw/${seekerId}`, {}, { responseType: 'text' });
    }

    // Bookmarks
    addBookmark(seekerId: number, jobId: number): Observable<string> {
        return this.http.post(`${this.API_URL}/jobseeker/bookmark/${seekerId}/${jobId}`, {}, { responseType: 'text' });
    }

    getBookmarks(seekerId: number): Observable<Bookmark[]> {
        return this.http.get<Bookmark[]>(`${this.API_URL}/jobseeker/bookmarks/${seekerId}`);
    }

    removeBookmark(bookmarkId: number): Observable<string> {
        return this.http.delete(`${this.API_URL}/jobseeker/bookmark/${bookmarkId}`, { responseType: 'text' });
    }

    // Flag Job
    flagJob(jobId: number, seekerId: number, reason: string): Observable<string> {
        const params = new HttpParams()
            .set('jobId', jobId.toString())
            .set('seekerId', seekerId.toString())
            .set('reason', reason);
        return this.http.post(`${this.API_URL}/jobseeker/flag-job`, null, { params, responseType: 'text' });
    }

    getFlaggedJobStatus(seekerId: number): Observable<FlaggedJobStatus[]> {
        return this.http.get<FlaggedJobStatus[]>(`${this.API_URL}/jobseeker/flag-status/${seekerId}`);
    }

    // ============== EMPLOYER ENDPOINTS ==============

    // Profile
    updateEmployerProfile(request: EmpProfileUpdateRequest): Observable<EmployerProfile> {
        return this.http.put<EmployerProfile>(`${this.API_URL}/employer/update_profile`, request);
    }

    // Public endpoints for employer setup (no auth required)
    getCompaniesForSetup(): Observable<Company[]> {
        return this.http.get<Company[]>(`${this.API_URL}/auth/setup/companies`);
    }

    updateEmployerProfileForSetup(request: EmpProfileUpdateRequest): Observable<EmployerProfile> {
        return this.http.put<EmployerProfile>(`${this.API_URL}/auth/setup/employer-profile`, request);
    }

    // Company (authenticated)
    getCompany(companyId: number): Observable<Company> {
        return this.http.get<Company>(`${this.API_URL}/employer/companies/fetch/${companyId}`);
    }

    getAllCompanies(): Observable<Company[]> {
        return this.http.get<Company[]>(`${this.API_URL}/employer/companies/all`);
    }

    searchCompanies(query: string): Observable<Company[]> {
        return this.http.get<Company[]>(`${this.API_URL}/employer/companies/search`, {
            params: { q: query }
        });
    }

    updateCompany(companyId: number, request: CompanyDto): Observable<Company> {
        return this.http.put<Company>(`${this.API_URL}/employer/companies/update/${companyId}`, request);
    }

    // Jobs (Employer)
    getEmployerJobs(employerId: number): Observable<Job[]> {
        return this.http.get<Job[]>(`${this.API_URL}/employer/jobs/${employerId}`);
    }

    createJob(request: JobCreateRequest): Observable<Job> {
        return this.http.post<Job>(`${this.API_URL}/employer/jobs/create`, request);
    }

    updateJob(jobId: number, employerId: number, request: JobUpdateRequest): Observable<Job> {
        return this.http.put<Job>(`${this.API_URL}/employer/jobs/update/${jobId}/${employerId}`, request);
    }

    deleteJob(jobId: number, employerId: number): Observable<string> {
        return this.http.delete(`${this.API_URL}/employer/jobs/delete/${jobId}/${employerId}`, { responseType: 'text' });
    }

    // Applicants
    getJobApplications(jobId: number, employerId: number): Observable<EmployerJobApplication[]> {
        return this.http.get<EmployerJobApplication[]>(`${this.API_URL}/employer/jobs/${jobId}/${employerId}/applications`);
    }

    updateApplicantStatus(request: JobApplicationUpdate): Observable<string> {
        return this.http.put(`${this.API_URL}/employer/jobs/updateApplicant`, request, { responseType: 'text' });
    }

    // Flag User
    flagUser(request: FlagUserRequest): Observable<string> {
        return this.http.post(`${this.API_URL}/employer/jobs/flagUser`, request, { responseType: 'text' });
    }

    // ============== ADMIN ENDPOINTS ==============

    // Statistics
    getSystemStatistics(): Observable<SystemStatistics> {
        return this.http.get<SystemStatistics>(`${this.API_URL}/admin/statistics`);
    }

    // Users
    getAllUsers(): Observable<UserDto[]> {
        return this.http.get<UserDto[]>(`${this.API_URL}/admin/users`);
    }

    getRevokedUsers(): Observable<UserDto[]> {
        return this.http.get<UserDto[]>(`${this.API_URL}/admin/revoked-users`);
    }

    revokeUser(userId: number): Observable<string> {
        return this.http.put(`${this.API_URL}/admin/users/${userId}/revoke`, {}, { responseType: 'text' });
    }

    deleteUser(userId: number): Observable<string> {
        return this.http.delete(`${this.API_URL}/admin/users/${userId}`, { responseType: 'text' });
    }

    // Employers
    getAllEmployers(): Observable<DisplayEmployerProfile[]> {
        return this.http.get<DisplayEmployerProfile[]>(`${this.API_URL}/admin/employers`);
    }

    approveEmployer(userId: number): Observable<string> {
        return this.http.put(`${this.API_URL}/admin/employers/${userId}/approve`, {}, { responseType: 'text' });
    }

    denyEmployer(userId: number): Observable<string> {
        return this.http.put(`${this.API_URL}/admin/employers/${userId}/deny`, {}, { responseType: 'text' });
    }

    // Flagged Job Seekers
    getFlaggedJobSeekers(): Observable<DisplayReportedJS[]> {
        return this.http.get<DisplayReportedJS[]>(`${this.API_URL}/admin/flagged-jobseekers`);
    }

    updateFlaggedJobSeeker(requestId: number, action: string): Observable<DisplayReportedJS> {
        return this.http.put<DisplayReportedJS>(`${this.API_URL}/admin/flagged-jobseeker/${requestId}/action`, action);
    }

    // Flagged Jobs
    getFlaggedJobs(): Observable<FlaggedJobDto[]> {
        return this.http.get<FlaggedJobDto[]>(`${this.API_URL}/admin/flagged-jobs`);
    }

    ignoreFlaggedJob(flagId: number): Observable<string> {
        return this.http.put(`${this.API_URL}/admin/flagged-jobs/${flagId}/ignore`, {}, { responseType: 'text' });
    }

    deleteFlaggedJob(flagId: number): Observable<string> {
        return this.http.put(`${this.API_URL}/admin/flagged-jobs/${flagId}/delete`, {}, { responseType: 'text' });
    }
}
