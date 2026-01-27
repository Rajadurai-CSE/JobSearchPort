import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { Job } from '../../../core/models/jobseeker.model';

@Component({
    selector: 'app-employer-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink, NavbarComponent],
    template: `
    <app-navbar></app-navbar>
    <div class="page-container">
      <div class="page-header">
        <h1>Employer Dashboard</h1>
        <p>Manage your job postings and applicants</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <h3>{{ jobs.length }}</h3>
          <p>Active Jobs</p>
        </div>
        <div class="stat-card">
          <h3>{{ totalApplicants }}</h3>
          <p>Total Applicants</p>
        </div>
      </div>

      <div class="flex justify-between items-center mb-3">
        <h2>Your Job Postings</h2>
        <a routerLink="/employer/jobs/create" class="btn btn-primary">+ Post New Job</a>
      </div>

      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
      </div>

      <div *ngIf="!loading" class="grid-2">
        <div *ngFor="let job of jobs" class="job-card">
          <div class="job-card-header">
            <h3 class="job-title">{{ job.title }}</h3>
          </div>
          <div class="job-meta">
            <span>📍 {{ job.location }}</span>
            <span>💰 {{ job.salaryRange }}</span>
            <span>👥 {{ job.applicantCount || 0 }} applicants</span>
          </div>
          <div class="job-actions">
            <a [routerLink]="['/employer/applicants', job.jobId]" class="btn btn-primary btn-sm">View Applicants</a>
            <a [routerLink]="['/employer/jobs', job.jobId, 'edit']" class="btn btn-outline btn-sm">Edit</a>
            <button class="btn btn-danger btn-sm" (click)="deleteJob(job.jobId)">Delete</button>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && jobs.length === 0" class="empty-state">
        <div class="empty-state-icon">📝</div>
        <h3>No jobs posted yet</h3>
        <p>Start by posting your first job opening</p>
        <a routerLink="/employer/jobs/create" class="btn btn-primary">Post a Job</a>
      </div>
    </div>
  `
})
export class EmployerDashboardComponent implements OnInit {
    jobs: Job[] = [];
    loading = false;
    totalApplicants = 0;

    constructor(private apiService: ApiService, private authService: AuthService) { }

    ngOnInit(): void {
        this.loadJobs();
    }

    loadJobs(): void {
        const userId = this.authService.getUserId();
        if (!userId) return;

        this.loading = true;
        this.apiService.getEmployerJobs(userId).subscribe({
            next: (data) => {
                this.jobs = data;
                this.totalApplicants = data.reduce((sum, job) => sum + (job.applicantCount || 0), 0);
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
    }

    deleteJob(jobId: number): void {
        const userId = this.authService.getUserId();
        if (!userId) return;

        if (confirm('Are you sure you want to delete this job posting?')) {
            this.apiService.deleteJob(jobId, userId).subscribe({
                next: () => this.loadJobs(),
                error: () => alert('Error deleting job')
            });
        }
    }
}
