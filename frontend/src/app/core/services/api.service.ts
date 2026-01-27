import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Job, JobSearchRequest, Application, Bookmark, FlaggedJobStatus, JobSeekerProfile } from '../models/jobseeker.model';
import { EmployerProfile, JobCreateRequest, Company, JobApplicationUpdate, FlagUserRequest, FlaggedJobSeekerStatus } from '../models/employer.model';
import { SystemStatistics, UserDto, FlaggedJob, DisplayEmployerProfile } from '../models/admin.model';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private readonly API_URL = 'http://localhost:8080';

    constructor(private http: HttpClient) { }

    // =============== JOB SEEKER APIs ===============

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
    applyForJob(seekerId: number, jobId: number): Observable<string> {
        return this.http.post(`${this.API_URL}/jobseeker/apply/${seekerId}/${jobId}`, {}, { responseType: 'text' });
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
        return this.http.post(`${this.API_URL}/jobseeker/flag-job?jobId=${jobId}&seekerId=${seekerId}&reason=${encodeURIComponent(reason)}`, {}, { responseType: 'text' });
    }

    getFlaggedJobStatus(seekerId: number): Observable<FlaggedJobStatus[]> {
        return this.http.get<FlaggedJobStatus[]>(`${this.API_URL}/jobseeker/flag-status/${seekerId}`);
    }

    // Profile
    getJobSeekerProfile(userId: number): Observable<JobSeekerProfile> {
        return this.http.get<JobSeekerProfile>(`${this.API_URL}/jobseeker/profile/${userId}`);
    }

    updateJobSeekerProfile(profile: JobSeekerProfile): Observable<JobSeekerProfile> {
        return this.http.put<JobSeekerProfile>(`${this.API_URL}/jobseeker/update_profile`, profile);
    }

    // =============== EMPLOYER APIs ===============

    // Profile
    updateEmployerProfile(profile: any): Observable<EmployerProfile> {
        return this.http.put<EmployerProfile>(`${this.API_URL}/employer/update_profile`, profile);
    }

    // Jobs
    getEmployerJobs(employerId: number): Observable<Job[]> {
        return this.http.get<Job[]>(`${this.API_URL}/employer/jobs/${employerId}`);
    }

    createJob(job: JobCreateRequest): Observable<Job> {
        return this.http.post<Job>(`${this.API_URL}/employer/jobs/create`, job);
    }

    updateJob(jobId: number, employerId: number, job: any): Observable<Job> {
        return this.http.put<Job>(`${this.API_URL}/employer/jobs/update/${jobId}/${employerId}`, job);
    }

    deleteJob(jobId: number, employerId: number): Observable<string> {
        return this.http.delete(`${this.API_URL}/employer/jobs/delete/${jobId}/${employerId}`, { responseType: 'text' });
    }

    // Flag user
    flagUser(request: FlagUserRequest): Observable<string> {
        return this.http.post(`${this.API_URL}/employer/jobs/flagUser`, request, { responseType: 'text' });
    }

    // Update applicant
    updateApplicant(update: JobApplicationUpdate): Observable<string> {
        return this.http.put(`${this.API_URL}/employer/jobs/updateApplicant`, update, { responseType: 'text' });
    }

    // =============== ADMIN APIs ===============

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

    deleteUser(userId: number): Observable<string> {
        return this.http.delete(`${this.API_URL}/admin/users/${userId}`, { responseType: 'text' });
    }

    revokeUser(userId: number): Observable<string> {
        return this.http.put(`${this.API_URL}/admin/users/${userId}/revoke`, {}, { responseType: 'text' });
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

    // Flagged JobSeekers
    getFlaggedJobSeekers(): Observable<any[]> {
        return this.http.get<any[]>(`${this.API_URL}/admin/flagged-jobseekers`);
    }

    updateFlaggedJobSeeker(requestId: number, action: string): Observable<any> {
        return this.http.put(`${this.API_URL}/admin/flagged-jobseeker/${requestId}/action`, action);
    }

    // Flagged Jobs
    getFlaggedJobs(): Observable<FlaggedJob[]> {
        return this.http.get<FlaggedJob[]>(`${this.API_URL}/admin/flagged-jobs`);
    }

    updateFlaggedJob(requestId: number, action: string): Observable<FlaggedJob> {
        return this.http.put<FlaggedJob>(`${this.API_URL}/admin/flagged-job/${requestId}/action`, action);
    }
}
