import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { Application } from '../../../core/models/job.model';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.css']
})
export class ApplicationsComponent implements OnInit {
  private apiService = inject(ApiService);
  private authService = inject(AuthService);

  applications: Application[] = [];
  loading = true;
  message = '';
  messageType = 'success';

  // Flag modal
  showFlagModal = false;
  selectedApp: Application | null = null;
  flagReason = '';

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.apiService.getApplications(userId).subscribe({
      next: (data) => {
        this.applications = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.showMessage('Failed to load applications', 'error');
      }
    });
  }

  withdrawApplication(app: Application): void {
    if (!confirm('Are you sure you want to withdraw this application?')) return;

    const userId = this.authService.getUserId();
    if (!userId) return;

    this.apiService.withdrawApplication(app.jobId, userId).subscribe({
      next: () => {
        this.showMessage('Application withdrawn', 'success');
        this.loadApplications();
      },
      error: (err) => this.showMessage(err.error || 'Failed to withdraw', 'error')
    });
  }

  openFlagModal(app: Application): void {
    this.selectedApp = app;
    this.showFlagModal = true;
  }

  closeFlagModal(): void {
    this.showFlagModal = false;
    this.selectedApp = null;
    this.flagReason = '';
  }

  submitFlag(): void {
    if (!this.selectedApp || !this.flagReason.trim()) return;

    const userId = this.authService.getUserId();
    if (!userId) return;

    this.apiService.flagJob(this.selectedApp.jobId, userId, this.flagReason).subscribe({
      next: () => {
        this.showMessage('Job reported successfully', 'success');
        this.closeFlagModal();
      },
      error: (err) => this.showMessage(err.error?.message || 'Failed to report job', 'error')
    });
  }

  getStageClass(stage: string): string {
    switch (stage) {
      case 'APPLIED': return 'badge-info';
      case 'SHORTLISTED': return 'badge-warning';
      case 'INTERVIEW': return 'badge-primary';
      case 'HIRED': return 'badge-success';
      case 'REJECTED': case 'WITHDRAWN': return 'badge-danger';
      default: return 'badge-secondary';
    }
  }

  private showMessage(msg: string, type: string): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => this.message = '', 3000);
  }
}

