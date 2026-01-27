import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { Application } from '../../../core/models/jobseeker.model';

@Component({
    selector: 'app-applications',
    standalone: true,
    imports: [CommonModule, RouterLink, NavbarComponent],
    template: `
    <app-navbar></app-navbar>
    <div class="page-container">
      <div class="page-header">
        <h1>📋 My Applications</h1>
        <p>Track the status of your job applications</p>
      </div>

      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
      </div>

      <div *ngIf="!loading">
        <!-- Stats -->
        <div class="stats-grid mb-4">
          <div class="stat-card">
            <h3>{{ applications.length }}</h3>
            <p>Total Applications</p>
          </div>
          <div class="stat-card" style="border-left-color: #f39c12;">
            <h3>{{ getStageCount('INTERVIEW') }}</h3>
            <p>Interview Requests</p>
          </div>
          <div class="stat-card" style="border-left-color: #2ecc71;">
            <h3>{{ getStageCount('SHORTLISTED') }}</h3>
            <p>Shortlisted</p>
          </div>
          <div class="stat-card" style="border-left-color: #e74c3c;">
            <h3>{{ getStageCount('REJECTED') }}</h3>
            <p>Rejected</p>
          </div>
        </div>

        <!-- Applications Table -->
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Company</th>
                <th>Applied On</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let app of applications">
                <td>
                  <a [routerLink]="['/jobseeker/jobs', app.jobId]" class="text-primary">{{ app.jobTitle }}</a>
                </td>
                <td>{{ app.companyName }}</td>
                <td>{{ app.appliedAt | date:'mediumDate' }}</td>
                <td>
                  <span class="badge" [ngClass]="getStageClass(app.stage)">{{ app.stage }}</span>
                </td>
                <td>
                  <button 
                    *ngIf="canWithdraw(app.stage)" 
                    class="btn btn-danger btn-sm" 
                    (click)="withdrawApplication(app.jobId)">
                    Withdraw
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div *ngIf="applications.length === 0" class="empty-state">
          <div class="empty-state-icon">📋</div>
          <h3>No applications yet</h3>
          <p>Start applying to jobs to see them here!</p>
          <a routerLink="/jobseeker/jobs" class="btn btn-primary">Browse Jobs</a>
        </div>
      </div>

      <div *ngIf="message" class="alert" [ngClass]="messageType === 'success' ? 'alert-success' : 'alert-danger'" style="position: fixed; bottom: 20px; right: 20px;">
        {{ message }}
      </div>
    </div>
  `
})
export class ApplicationsComponent implements OnInit {
    applications: Application[] = [];
    loading = false;
    message = '';
    messageType = 'success';

    constructor(private apiService: ApiService, private authService: AuthService) { }

    ngOnInit(): void {
        this.loadApplications();
    }

    loadApplications(): void {
        const userId = this.authService.getUserId();
        if (!userId) return;

        this.loading = true;
        this.apiService.getApplications(userId).subscribe({
            next: (data) => {
                this.applications = data;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.showMessage('Error loading applications', 'error');
            }
        });
    }

    getStageCount(stage: string): number {
        return this.applications.filter(a => a.stage === stage).length;
    }

    canWithdraw(stage: string): boolean {
        return ['APPLIED', 'SHORTLISTED'].includes(stage);
    }

    withdrawApplication(jobId: number): void {
        const userId = this.authService.getUserId();
        if (!userId) return;

        this.apiService.withdrawApplication(jobId, userId).subscribe({
            next: () => {
                this.showMessage('Application withdrawn', 'success');
                this.loadApplications();
            },
            error: () => this.showMessage('Error withdrawing application', 'error')
        });
    }

    getStageClass(stage: string): string {
        switch (stage) {
            case 'APPLIED': return 'badge-info';
            case 'SHORTLISTED': return 'badge-primary';
            case 'INTERVIEW': return 'badge-warning';
            case 'HIRED': return 'badge-success';
            case 'REJECTED': case 'WITHDRAWN': return 'badge-danger';
            default: return 'badge-info';
        }
    }

    private showMessage(msg: string, type: string): void {
        this.message = msg;
        this.messageType = type;
        setTimeout(() => this.message = '', 3000);
    }
}
