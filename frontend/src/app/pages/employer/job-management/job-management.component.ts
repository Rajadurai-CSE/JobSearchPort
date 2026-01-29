import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { Job } from '../../../core/models/job.model';

@Component({
  selector: 'app-job-management',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './job-management.component.html',
  styleUrls: [ './job-management.component.css']
})
export class JobManagementComponent implements OnInit {
  private apiService = inject(ApiService);
  private authService = inject(AuthService);

  jobs: Job[] = [];
  loading = true;
  message = '';
  messageType = 'success';

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.apiService.getEmployerJobs(userId).subscribe({
      next: (data) => {
        this.jobs = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  deleteJob(job: Job): void {
    if (!confirm(`Delete job "${job.title}"?`)) return;

    const userId = this.authService.getUserId();
    if (!userId) return;

    this.apiService.deleteJob(job.jobId, userId).subscribe({
      next: () => {
        this.showMessage('Job deleted', 'success');
        this.jobs = this.jobs.filter(j => j.jobId !== job.jobId);
      },
      error: () => this.showMessage('Failed to delete', 'error')
    });
  }

  private showMessage(msg: string, type: string): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => this.message = '', 3000);
  }
}
