import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { Application, Bookmark } from '../../../core/models/jobseeker.model';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink, NavbarComponent],
    template: `
    <app-navbar></app-navbar>
    <div class="page-container">
      <div class="page-header">
        <h1>Welcome back! 👋</h1>
        <p>Here's an overview of your job search activity</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <h3>{{ applications.length }}</h3>
          <p>Total Applications</p>
        </div>
        <div class="stat-card">
          <h3>{{ activeApplications }}</h3>
          <p>Active Applications</p>
        </div>
        <div class="stat-card">
          <h3>{{ interviews }}</h3>
          <p>Interview Requests</p>
        </div>
        <div class="stat-card">
          <h3>{{ bookmarks.length }}</h3>
          <p>Saved Jobs</p>
        </div>
      </div>

      <div class="grid-2">
        <!-- Recent Applications -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Recent Applications</h3>
            <a routerLink="/jobseeker/applications" class="btn btn-sm btn-outline">View All</a>
          </div>
          
          <div *ngIf="applications.length === 0" class="empty-state">
            <p>No applications yet. <a routerLink="/jobseeker/jobs">Start applying!</a></p>
          </div>

          <div *ngFor="let app of applications.slice(0, 5)" class="application-item">
            <div class="application-info">
              <h4>{{ app.jobTitle }}</h4>
              <p class="text-muted">{{ app.companyName }}</p>
            </div>
            <span class="badge" [ngClass]="getStageClass(app.stage)">{{ app.stage }}</span>
          </div>
        </div>

        <!-- Bookmarked Jobs -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Saved Jobs</h3>
            <a routerLink="/jobseeker/bookmarks" class="btn btn-sm btn-outline">View All</a>
          </div>
          
          <div *ngIf="bookmarks.length === 0" class="empty-state">
            <p>No saved jobs. <a routerLink="/jobseeker/jobs">Browse jobs!</a></p>
          </div>

          <div *ngFor="let bookmark of bookmarks.slice(0, 5)" class="bookmark-item">
            <div class="bookmark-info">
              <h4>{{ bookmark.jobTitle }}</h4>
              <p class="text-muted">{{ bookmark.companyName }} • {{ bookmark.location }}</p>
            </div>
            <a [routerLink]="['/jobseeker/jobs', bookmark.jobId]" class="btn btn-sm btn-primary">View</a>
          </div>
        </div>
      </div>

      <div class="quick-actions mt-4">
        <h3>Quick Actions</h3>
        <div class="flex gap-2">
          <a routerLink="/jobseeker/jobs" class="btn btn-primary">🔍 Find Jobs</a>
          <a routerLink="/jobseeker/profile" class="btn btn-secondary">👤 Update Profile</a>
          <a routerLink="/jobseeker/applications" class="btn btn-outline">📋 Track Applications</a>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .application-item, .bookmark-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
      border-bottom: 1px solid var(--gray-light);
    }
    .application-item:last-child, .bookmark-item:last-child {
      border-bottom: none;
    }
    .application-info h4, .bookmark-info h4 {
      margin: 0;
      font-size: 1rem;
      color: var(--primary);
    }
    .application-info p, .bookmark-info p {
      margin: 0.25rem 0 0;
      font-size: 0.85rem;
    }
    .quick-actions {
      margin-top: 2rem;
    }
    .quick-actions h3 {
      margin-bottom: 1rem;
    }
  `]
})
export class DashboardComponent implements OnInit {
    applications: Application[] = [];
    bookmarks: Bookmark[] = [];

    constructor(private apiService: ApiService, private authService: AuthService) { }

    ngOnInit(): void {
        const userId = this.authService.getUserId();
        if (userId) {
            this.loadApplications(userId);
            this.loadBookmarks(userId);
        }
    }

    loadApplications(userId: number): void {
        this.apiService.getApplications(userId).subscribe({
            next: (data) => this.applications = data,
            error: (err) => console.error('Error loading applications', err)
        });
    }

    loadBookmarks(userId: number): void {
        this.apiService.getBookmarks(userId).subscribe({
            next: (data) => this.bookmarks = data,
            error: (err) => console.error('Error loading bookmarks', err)
        });
    }

    get activeApplications(): number {
        return this.applications.filter(a =>
            !['REJECTED', 'WITHDRAWN', 'HIRED'].includes(a.stage)
        ).length;
    }

    get interviews(): number {
        return this.applications.filter(a => a.stage === 'INTERVIEW').length;
    }

    getStageClass(stage: string): string {
        switch (stage) {
            case 'APPLIED': return 'badge-info';
            case 'SHORTLISTED': return 'badge-primary';
            case 'INTERVIEW': return 'badge-warning';
            case 'HIRED': return 'badge-success';
            case 'REJECTED': return 'badge-danger';
            case 'WITHDRAWN': return 'badge-danger';
            default: return 'badge-info';
        }
    }
}
