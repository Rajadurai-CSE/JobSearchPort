import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { Job } from '../../../core/models/job.model';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.css']
})
export class JobDetailComponent implements OnInit {
  private apiService = inject(ApiService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  job: Job | null = null;
  loading = true;
  message = '';
  messageType = 'success';
  showFlagModal = false;
  flagReason = '';
  showApplyModal = false;
  resumeUrl = '';
  hasApplied = false;

  ngOnInit(): void {
    const jobId = this.route.snapshot.paramMap.get('id');
    if (jobId) {
      this.loadJob(+jobId);
      this.checkIfApplied(+jobId);
    }
  }

  loadJob(jobId: number): void {
    this.apiService.getJobDetails(jobId).subscribe({
      next: (data) => {
        this.job = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.showMessage('Job not found', 'error');
      }
    });
  }

  checkIfApplied(jobId: number): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.apiService.getApplications(userId).subscribe({
      next: (applications) => {
        this.hasApplied = applications.some(app => app.jobId === jobId);
      }
    });
  }

  openApplyModal(): void {
    if (this.hasApplied) {
      this.showMessage('You have already applied for this job', 'error');
      return;
    }
    this.showApplyModal = true;
  }

  closeApplyModal(): void {
    this.showApplyModal = false;
    this.resumeUrl = '';
  }

  applyJob(): void {
    if (!this.job) return;
    const userId = this.authService.getUserId();
    if (!userId) return;

    if (!this.resumeUrl.trim()) {
      this.showMessage('Resume URL is required', 'error');
      return;
    }

    this.apiService.applyForJob(this.job.jobId, userId, this.resumeUrl).subscribe({
      next: () => {
        this.showMessage('Applied successfully!', 'success');
        this.hasApplied = true;
        this.closeApplyModal();
      },
      error: (err) => this.showMessage(err.error || 'Failed to apply', 'error')
    });
  }

  bookmarkJob(): void {
    if (!this.job) return;
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.apiService.addBookmark(userId, this.job.jobId).subscribe({
      next: () => this.showMessage('Job bookmarked!', 'success'),
      error: (err) => this.showMessage(err.error || 'Failed to bookmark', 'error')
    });
  }

  openFlagModal(): void {
    this.showFlagModal = true;
  }

  closeFlagModal(): void {
    this.showFlagModal = false;
    this.flagReason = '';
  }

  submitFlag(): void {
    if (!this.job || !this.flagReason.trim()) return;
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.apiService.flagJob(this.job.jobId, userId, this.flagReason).subscribe({
      next: () => {
        this.showMessage('Job reported successfully', 'success');
        this.closeFlagModal();
      },
      error: (err) => this.showMessage(err.error || 'Failed to report', 'error')
    });
  }

  private showMessage(msg: string, type: string): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => this.message = '', 3000);
  }
}
