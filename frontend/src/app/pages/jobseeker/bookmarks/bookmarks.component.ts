import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { Bookmark } from '../../../core/models/jobseeker.model';

@Component({
    selector: 'app-bookmarks',
    standalone: true,
    imports: [CommonModule, RouterLink, NavbarComponent],
    template: `
    <app-navbar></app-navbar>
    <div class="page-container">
      <div class="page-header">
        <h1>❤️ Saved Jobs</h1>
        <p>Jobs you've bookmarked for later</p>
      </div>

      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
      </div>

      <div *ngIf="!loading" class="grid-2">
        <div *ngFor="let bookmark of bookmarks" class="job-card">
          <div class="job-card-header">
            <div>
              <h3 class="job-title">{{ bookmark.jobTitle }}</h3>
              <p class="job-company">{{ bookmark.companyName }}</p>
            </div>
            <button class="btn btn-danger btn-sm" (click)="removeBookmark(bookmark.bookmarkId)">✕</button>
          </div>
          
          <div class="job-meta">
            <span>📍 {{ bookmark.location }}</span>
            <span>💰 {{ bookmark.salaryRange }}</span>
          </div>

          <div class="job-actions">
            <a [routerLink]="['/jobseeker/jobs', bookmark.jobId]" class="btn btn-primary btn-sm">View Job</a>
            <button class="btn btn-success btn-sm" (click)="applyForJob(bookmark.jobId)">Apply Now</button>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && bookmarks.length === 0" class="empty-state">
        <div class="empty-state-icon">❤️</div>
        <h3>No saved jobs</h3>
        <p>Bookmark jobs you're interested in to save them here!</p>
        <a routerLink="/jobseeker/jobs" class="btn btn-primary">Browse Jobs</a>
      </div>

      <div *ngIf="message" class="alert" [ngClass]="messageType === 'success' ? 'alert-success' : 'alert-danger'" style="position: fixed; bottom: 20px; right: 20px;">
        {{ message }}
      </div>
    </div>
  `
})
export class BookmarksComponent implements OnInit {
    bookmarks: Bookmark[] = [];
    loading = false;
    message = '';
    messageType = 'success';

    constructor(private apiService: ApiService, private authService: AuthService) { }

    ngOnInit(): void {
        this.loadBookmarks();
    }

    loadBookmarks(): void {
        const userId = this.authService.getUserId();
        if (!userId) return;

        this.loading = true;
        this.apiService.getBookmarks(userId).subscribe({
            next: (data) => {
                this.bookmarks = data;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.showMessage('Error loading bookmarks', 'error');
            }
        });
    }

    removeBookmark(bookmarkId: number): void {
        this.apiService.removeBookmark(bookmarkId).subscribe({
            next: () => {
                this.showMessage('Bookmark removed', 'success');
                this.loadBookmarks();
            },
            error: () => this.showMessage('Error removing bookmark', 'error')
        });
    }

    applyForJob(jobId: number): void {
        const userId = this.authService.getUserId();
        if (!userId) return;

        this.apiService.applyForJob(userId, jobId).subscribe({
            next: () => this.showMessage('Applied successfully!', 'success'),
            error: (err) => this.showMessage(err.error || 'Error applying', 'error')
        });
    }

    private showMessage(msg: string, type: string): void {
        this.message = msg;
        this.messageType = type;
        setTimeout(() => this.message = '', 3000);
    }
}
