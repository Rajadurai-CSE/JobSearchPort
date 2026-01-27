import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { Job } from '../../../core/models/jobseeker.model';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-job-detail',
    standalone: true,
    imports: [CommonModule, RouterLink, NavbarComponent, FormsModule],
    template: `
    <app-navbar></app-navbar>
    <div class="page-container">
      <a routerLink="/jobseeker/jobs" class="btn btn-outline mb-3">← Back to Jobs</a>

      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
      </div>

      <div *ngIf="job && !loading" class="grid-3" style="grid-template-columns: 2fr 1fr;">
        <!-- Job Details -->
        <div class="card">
          <h1 style="margin-bottom: 0.5rem;">{{ job.title }}</h1>
          <p class="text-muted" style="font-size: 1.1rem;">{{ job.companyName || 'Company' }}</p>

          <div class="job-meta" style="margin: 1.5rem 0;">
            <span>📍 {{ job.location }}</span>
            <span>💰 {{ job.salaryRange }}</span>
            <span>📅 {{ job.minimumExperience }}+ years experience</span>
            <span>⏰ {{ job.employmentType }}</span>
            <span>👥 {{ job.noOfVacancies }} openings</span>
          </div>

          <hr style="border: none; border-top: 1px solid var(--gray-light); margin: 1.5rem 0;">

          <h3>Job Description</h3>
          <p style="white-space: pre-line;">{{ job.description }}</p>

          <h3>Required Skills</h3>
          <div class="flex flex-wrap gap-1">
            <span *ngFor="let skill of getSkills()" class="badge badge-primary">{{ skill }}</span>
          </div>

          <div *ngIf="job.applicationDeadline" style="margin-top: 1.5rem;">
            <p class="text-muted">
              <strong>Application Deadline:</strong> {{ job.applicationDeadline | date:'mediumDate' }}
            </p>
          </div>
        </div>

        <!-- Actions Sidebar -->
        <div class="card" style="height: fit-content;">
          <h3>Interested?</h3>
          <div class="flex" style="flex-direction: column; gap: 1rem;">
            <button class="btn btn-primary btn-lg" (click)="applyForJob()">Apply Now</button>
            <button class="btn btn-outline" (click)="bookmarkJob()">❤️ Save Job</button>
            <button class="btn btn-danger btn-sm" (click)="showFlagModal = true">🚩 Report Job</button>
          </div>

          <div *ngIf="message" class="alert mt-2" [ngClass]="messageType === 'success' ? 'alert-success' : 'alert-danger'">
            {{ message }}
          </div>
        </div>
      </div>

      <!-- Flag Modal -->
      <div *ngIf="showFlagModal" class="modal-overlay" (click)="showFlagModal = false">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <h3>Report this Job</h3>
          <div class="form-group">
            <label class="form-label">Reason for reporting</label>
            <textarea class="form-textarea" [(ngModel)]="flagReason" placeholder="Please explain why you're reporting this job..."></textarea>
          </div>
          <div class="flex gap-2">
            <button class="btn btn-danger" (click)="submitFlag()">Submit Report</button>
            <button class="btn btn-outline" (click)="showFlagModal = false">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .modal-content {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      max-width: 500px;
      width: 90%;
    }
  `]
})
export class JobDetailComponent implements OnInit {
    job: Job | null = null;
    loading = false;
    message = '';
    messageType = 'success';
    showFlagModal = false;
    flagReason = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private apiService: ApiService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        const jobId = this.route.snapshot.paramMap.get('id');
        if (jobId) {
            this.loadJob(+jobId);
        }
    }

    loadJob(jobId: number): void {
        this.loading = true;
        this.apiService.getJobDetails(jobId).subscribe({
            next: (data) => {
                this.job = data;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.router.navigate(['/jobseeker/jobs']);
            }
        });
    }

    getSkills(): string[] {
        if (!this.job?.requiredSkills) return [];
        return this.job.requiredSkills.split(',').map(s => s.trim());
    }

    applyForJob(): void {
        const userId = this.authService.getUserId();
        if (!userId || !this.job) return;

        this.apiService.applyForJob(userId, this.job.jobId).subscribe({
            next: () => this.showMessage('Applied successfully!', 'success'),
            error: (err) => this.showMessage(err.error || 'Error applying', 'error')
        });
    }

    bookmarkJob(): void {
        const userId = this.authService.getUserId();
        if (!userId || !this.job) return;

        this.apiService.addBookmark(userId, this.job.jobId).subscribe({
            next: () => this.showMessage('Job saved!', 'success'),
            error: (err) => this.showMessage(err.error || 'Error saving job', 'error')
        });
    }

    submitFlag(): void {
        const userId = this.authService.getUserId();
        if (!userId || !this.job || !this.flagReason) return;

        this.apiService.flagJob(this.job.jobId, userId, this.flagReason).subscribe({
            next: () => {
                this.showFlagModal = false;
                this.flagReason = '';
                this.showMessage('Job reported successfully', 'success');
            },
            error: () => this.showMessage('Error reporting job', 'error')
        });
    }

    private showMessage(msg: string, type: string): void {
        this.message = msg;
        this.messageType = type;
        setTimeout(() => this.message = '', 3000);
    }
}
