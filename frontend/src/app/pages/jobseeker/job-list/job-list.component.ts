import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { Job, JobSearchRequest } from '../../../core/models/jobseeker.model';

@Component({
    selector: 'app-job-list',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
    template: `
    <app-navbar></app-navbar>
    <div class="page-container">
      <div class="page-header">
        <h1>🔍 Find Your Dream Job</h1>
        <p>Discover opportunities that match your skills</p>
      </div>

      <!-- Search Filters -->
      <div class="card mb-3">
        <div class="search-bar">
          <input 
            type="text" 
            class="form-input" 
            [(ngModel)]="searchFilters.location" 
            placeholder="📍 Location (e.g., Remote, New York)">
          <input 
            type="text" 
            class="form-input" 
            [(ngModel)]="searchFilters.skills" 
            placeholder="🛠️ Skills (e.g., Java, Angular)">
          <input 
            type="number" 
            class="form-input" 
            [(ngModel)]="searchFilters.minExperience" 
            placeholder="⏱️ Max Experience Required"
            style="max-width: 200px;">
          <button class="btn btn-primary" (click)="searchJobs()">Search Jobs</button>
          <button class="btn btn-outline" (click)="clearFilters()">Clear</button>
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
      </div>

      <!-- Job List -->
      <div *ngIf="!loading">
        <p class="text-muted mb-2">Found {{ jobs.length }} jobs</p>
        
        <div class="grid-2">
          <div *ngFor="let job of jobs" class="job-card">
            <div class="job-card-header">
              <div>
                <h3 class="job-title">{{ job.title }}</h3>
                <p class="job-company">{{ job.companyName || 'Company' }}</p>
              </div>
            </div>
            
            <div class="job-meta">
              <span>📍 {{ job.location }}</span>
              <span>💰 {{ job.salaryRange }}</span>
              <span>📅 {{ job.minimumExperience }}+ years</span>
              <span>👥 {{ job.noOfVacancies }} positions</span>
            </div>

            <p class="text-muted" style="font-size: 0.9rem;">
              {{ job.description | slice:0:150 }}{{ job.description.length > 150 ? '...' : '' }}
            </p>

            <div class="job-actions">
              <a [routerLink]="['/jobseeker/jobs', job.jobId]" class="btn btn-primary btn-sm">View Details</a>
              <button class="btn btn-outline btn-sm" (click)="bookmarkJob(job.jobId)">❤️ Save</button>
              <button class="btn btn-success btn-sm" (click)="applyForJob(job.jobId)">Apply Now</button>
            </div>
          </div>
        </div>

        <div *ngIf="jobs.length === 0" class="empty-state">
          <div class="empty-state-icon">🔍</div>
          <h3>No jobs found</h3>
          <p>Try adjusting your search filters</p>
        </div>
      </div>

      <!-- Messages -->
      <div *ngIf="message" class="alert" [ngClass]="messageType === 'success' ? 'alert-success' : 'alert-danger'" style="position: fixed; bottom: 20px; right: 20px; z-index: 1000;">
        {{ message }}
      </div>
    </div>
  `
})
export class JobListComponent implements OnInit {
    jobs: Job[] = [];
    loading = false;
    message = '';
    messageType = 'success';

    searchFilters: JobSearchRequest = {
        location: '',
        skills: '',
        minExperience: undefined,
        salaryRange: ''
    };

    constructor(private apiService: ApiService, private authService: AuthService) { }

    ngOnInit(): void {
        this.loadAllJobs();
    }

    loadAllJobs(): void {
        this.loading = true;
        this.apiService.getAllJobs().subscribe({
            next: (data) => {
                this.jobs = data;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.showMessage('Error loading jobs', 'error');
            }
        });
    }

    searchJobs(): void {
        this.loading = true;
        this.apiService.searchJobs(this.searchFilters).subscribe({
            next: (data) => {
                this.jobs = data;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.showMessage('Error searching jobs', 'error');
            }
        });
    }

    clearFilters(): void {
        this.searchFilters = { location: '', skills: '', minExperience: undefined, salaryRange: '' };
        this.loadAllJobs();
    }

    bookmarkJob(jobId: number): void {
        const userId = this.authService.getUserId();
        if (!userId) return;

        this.apiService.addBookmark(userId, jobId).subscribe({
            next: () => this.showMessage('Job saved to bookmarks!', 'success'),
            error: (err) => this.showMessage(err.error || 'Error saving job', 'error')
        });
    }

    applyForJob(jobId: number): void {
        const userId = this.authService.getUserId();
        if (!userId) return;

        this.apiService.applyForJob(userId, jobId).subscribe({
            next: () => this.showMessage('Applied successfully!', 'success'),
            error: (err) => this.showMessage(err.error || 'Error applying for job', 'error')
        });
    }

    private showMessage(msg: string, type: string): void {
        this.message = msg;
        this.messageType = type;
        setTimeout(() => this.message = '', 3000);
    }
}
