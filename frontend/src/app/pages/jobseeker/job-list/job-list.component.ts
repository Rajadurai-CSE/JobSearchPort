import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { Job, JobSearchRequest } from '../../../core/models/job.model';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css']
})
export class JobListComponent implements OnInit {
  private apiService = inject(ApiService);
  private authService = inject(AuthService);

  jobs: Job[] = [];
  loading = true;
  message = '';
  messageType = 'success';

  // Search filters
  searchTitle = '';
  searchLocation = '';
  searchMinExp = '';
  searchSkills = '';

  // Apply modal
  showApplyModal = false;
  selectedJobId: number | null = null;
  selectedJobTitle = '';
  resumeUrl = '';
  appliedJobIds: Set<number> = new Set();

  ngOnInit(): void {
    this.loadJobs();
    this.loadAppliedJobs();
  }

  loadJobs(): void {
    this.loading = true;
    this.apiService.getAllJobs().subscribe({
      next: (data) => {
        this.jobs = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.showMessage('Failed to load jobs', 'error');
      }
    });
  }

  loadAppliedJobs(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.apiService.getApplications(userId).subscribe({
      next: (applications) => {
        this.appliedJobIds = new Set(applications.map(app => app.jobId));
      }
    });
  }

  searchJobs(): void {
    const request: JobSearchRequest = {};
    if (this.searchTitle) request.title = this.searchTitle;
    if (this.searchLocation) request.location = this.searchLocation;
    if (this.searchMinExp) request.minExperience = parseInt(this.searchMinExp);
    if (this.searchSkills) request.skills = this.searchSkills;

    this.loading = true;
    this.apiService.searchJobs(request).subscribe({
      next: (data) => {
        this.jobs = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.showMessage('Search failed', 'error');
      }
    });
  }

  clearFilters(): void {
    this.searchTitle = '';
    this.searchLocation = '';
    this.searchMinExp = '';
    this.searchSkills = '';
    this.loadJobs();
  }

  openApplyModal(jobId: number, jobTitle: string): void {
    if (this.appliedJobIds.has(jobId)) {
      this.showMessage('You have already applied for this job', 'error');
      return;
    }
    this.selectedJobId = jobId;
    this.selectedJobTitle = jobTitle;
    this.showApplyModal = true;
  }

  closeApplyModal(): void {
    this.showApplyModal = false;
    this.selectedJobId = null;
    this.selectedJobTitle = '';
    this.resumeUrl = '';
  }

  applyJob(): void {
    const userId = this.authService.getUserId();
    if (!userId || !this.selectedJobId) return;

    if (!this.resumeUrl.trim()) {
      this.showMessage('Resume URL is required', 'error');
      return;
    }

    const jobId = this.selectedJobId;
    this.apiService.applyForJob(jobId, userId, this.resumeUrl).subscribe({
      next: () => {
        this.showMessage('Applied successfully!', 'success');
        this.appliedJobIds.add(jobId);
        this.closeApplyModal();
      },
      error: (err) => this.showMessage(err.error || 'Failed to apply', 'error')
    });
  }

  bookmarkJob(jobId: number): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.apiService.addBookmark(userId, jobId).subscribe({
      next: () => this.showMessage('Job bookmarked!', 'success'),
      error: (err) => this.showMessage(err.error || 'Failed to bookmark', 'error')
    });
  }

  private showMessage(msg: string, type: string): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => this.message = '', 3000);
  }
}

