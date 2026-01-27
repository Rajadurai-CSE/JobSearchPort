import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ApiService } from '../../../core/services/api.service';
import { SystemStatistics } from '../../../core/models/admin.model';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink, NavbarComponent],
    template: `
    <app-navbar></app-navbar>
    <div class="page-container">
      <div class="page-header">
        <h1>Admin Dashboard</h1>
        <p>System overview and management</p>
      </div>

      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
      </div>

      <div *ngIf="!loading && stats">
        <div class="stats-grid">
          <div class="stat-card">
            <h3>{{ stats.totalJobSeekers }}</h3>
            <p>Job Seekers</p>
          </div>
          <div class="stat-card">
            <h3>{{ stats.totalEmployers }}</h3>
            <p>Employers</p>
          </div>
          <div class="stat-card">
            <h3>{{ stats.totalJobs }}</h3>
            <p>Active Jobs</p>
          </div>
          <div class="stat-card">
            <h3>{{ stats.totalApplications }}</h3>
            <p>Total Applications</p>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-card" style="border-left-color: #f39c12;">
            <h3>{{ stats.pendingEmployers }}</h3>
            <p>Pending Employers</p>
          </div>
          <div class="stat-card" style="border-left-color: #e74c3c;">
            <h3>{{ stats.flaggedJobSeekers }}</h3>
            <p>Flagged Job Seekers</p>
          </div>
          <div class="stat-card" style="border-left-color: #e74c3c;">
            <h3>{{ stats.flaggedJobs }}</h3>
            <p>Flagged Jobs</p>
          </div>
          <div class="stat-card" style="border-left-color: #c0392b;">
            <h3>{{ stats.revokedUsers }}</h3>
            <p>Revoked Users</p>
          </div>
        </div>

        <div class="grid-2 mt-4">
          <a routerLink="/admin/employers" class="card" style="text-decoration: none;">
            <h3>👔 Employer Approvals</h3>
            <p class="text-muted">Review and approve employer registrations</p>
            <span class="badge badge-warning">{{ stats.pendingEmployers }} pending</span>
          </a>

          <a routerLink="/admin/flagged-jobs" class="card" style="text-decoration: none;">
            <h3>🚩 Flagged Jobs</h3>
            <p class="text-muted">Review jobs reported by job seekers</p>
            <span class="badge badge-danger">{{ stats.flaggedJobs }} reports</span>
          </a>

          <a routerLink="/admin/flagged-jobseekers" class="card" style="text-decoration: none;">
            <h3>⚠️ Flagged Job Seekers</h3>
            <p class="text-muted">Review job seekers flagged by employers</p>
            <span class="badge badge-danger">{{ stats.flaggedJobSeekers }} reports</span>
          </a>

          <a routerLink="/admin/users" class="card" style="text-decoration: none;">
            <h3>👥 User Management</h3>
            <p class="text-muted">View and manage all users</p>
          </a>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
    stats: SystemStatistics | null = null;
    loading = false;

    constructor(private apiService: ApiService) { }

    ngOnInit(): void {
        this.loadStats();
    }

    loadStats(): void {
        this.loading = true;
        this.apiService.getSystemStatistics().subscribe({
            next: (data) => {
                this.stats = data;
                this.loading = false;
            },
            error: () => this.loading = false
        });
    }
}
