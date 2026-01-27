import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { Job } from '../../../core/models/jobseeker.model';

@Component({
    selector: 'app-job-management',
    standalone: true,
    imports: [CommonModule, RouterLink, NavbarComponent],
    template: `
    <app-navbar></app-navbar>
    <div class="page-container">
      <div class="page-header flex justify-between items-center">
        <div>
          <h1>Job Management</h1>
          <p>Manage all your job postings</p>
        </div>
        <a routerLink="/employer/jobs/create" class="btn btn-primary">+ Post New Job</a>
      </div>

      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
      </div>

      <div *ngIf="!loading" class="table-container">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Location</th>
              <th>Salary</th>
              <th>Vacancies</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let job of jobs">
              <td><strong>{{ job.title }}</strong></td>
              <td>{{ job.location }}</td>
              <td>{{ job.salaryRange }}</td>
              <td>{{ job.noOfVacancies }}</td>
              <td>{{ job.createdAt | date:'shortDate' }}</td>
              <td>
                <div class="flex gap-1">
                  <a [routerLink]="['/employer/applicants', job.jobId]" class="btn btn-primary btn-sm">Applicants</a>
                  <a [routerLink]="['/employer/jobs', job.jobId, 'edit']" class="btn btn-outline btn-sm">Edit</a>
                  <button class="btn btn-danger btn-sm" (click)="deleteJob(job.jobId)">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="!loading && jobs.length === 0" class="empty-state">
        <div class="empty-state-icon">📝</div>
        <h3>No jobs posted yet</h3>
        <a routerLink="/employer/jobs/create" class="btn btn-primary">Post Your First Job</a>
      </div>
    </div>
  `
})
export class JobManagementComponent implements OnInit {
    jobs: Job[] = [];
    loading = false;

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
                this.loading = false;
            },
            error: () => this.loading = false
        });
    }

    deleteJob(jobId: number): void {
        const userId = this.authService.getUserId();
        if (!userId || !confirm('Delete this job?')) return;

        this.apiService.deleteJob(jobId, userId).subscribe({
            next: () => this.loadJobs(),
            error: () => alert('Error deleting job')
        });
    }
}
