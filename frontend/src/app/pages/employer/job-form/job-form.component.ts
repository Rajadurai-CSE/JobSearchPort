import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { JobCreateRequest, JobUpdateRequest } from '../../../core/models/job.model';

@Component({
  selector: 'app-job-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.css']
})
export class JobFormComponent implements OnInit {
  private apiService = inject(ApiService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEditMode = false;
  jobId: number | null = null;
  loading = false;
  saving = false;
  message = '';
  messageType = 'success';

  formData = {
    title: '',
    description: '',
    location: '',
    requiredSkills: '',
    salaryRange: '',
    noOfVacancies: 1,
    minimumExperience: 0,
    employmentType: 'FULL_TIME',
    applicationDeadline: ''
  };

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.jobId = +id;
      this.loadJob(this.jobId);
    }
  }

  loadJob(jobId: number): void {
    this.loading = true;
    const userId = this.authService.getUserId();
    if (!userId) {
      this.loading = false;
      this.showMessage('User not authenticated', 'error');
      return;
    }

    console.log('Loading job with ID:', jobId, 'for employer:', userId);
    this.apiService.getEmployerJobDetails(jobId, userId).subscribe({
      next: (job) => {
        console.log('Job data received:', job);
        this.formData = {
          title: job.title || '',
          description: job.description || '',
          location: job.location || '',
          requiredSkills: job.requiredSkills || '',
          salaryRange: job.salaryRange || '',
          noOfVacancies: job.noOfVacancies || 1,
          minimumExperience: job.minimumExperience || 0,
          employmentType: job.employmentType || 'FULL_TIME',
          applicationDeadline: job.applicationDeadline?.split('T')[0] || ''
        };
        console.log('Form data set:', this.formData);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading job:', err);
        this.loading = false;
        this.showMessage('Failed to load job details', 'error');
      }
    });
  }

  onSubmit(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    // Validate required fields for creation
    if (!this.isEditMode) {
      if (!this.formData.title.trim()) {
        this.showMessage('Job title is required', 'error');
        return;
      }
      if (!this.formData.description.trim()) {
        this.showMessage('Job description is required', 'error');
        return;
      }
      if (!this.formData.location.trim()) {
        this.showMessage('Location is required', 'error');
        return;
      }
      if (!this.formData.salaryRange.trim()) {
        this.showMessage('Salary range is required', 'error');
        return;
      }
      if (!this.formData.requiredSkills.trim()) {
        this.showMessage('Required skills are required', 'error');
        return;
      }
    }

    // Validate deadline (required and not in past)
    if (!this.formData.applicationDeadline) {
      this.showMessage('Application deadline is required', 'error');
      return;
    }

    const deadline = new Date(this.formData.applicationDeadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (deadline < today) {
      this.showMessage('Application deadline cannot be in the past', 'error');
      return;
    }

    this.saving = true;

    if (this.isEditMode && this.jobId) {
      // In edit mode, only update vacancies and deadline
      const request: JobUpdateRequest = {
        noOfVacancies: this.formData.noOfVacancies,
        applicationDeadline: this.formData.applicationDeadline
      };
      this.apiService.updateJob(this.jobId, userId, request).subscribe({
        next: () => {
          this.saving = false;
          this.showMessage('Job updated!', 'success');
          setTimeout(() => this.router.navigate(['/employer/jobs']), 1500);
        },
        error: (err) => {
          this.saving = false;
          this.showMessage(err.error || 'Failed to update', 'error');
        }
      });
    } else {
      const request: JobCreateRequest = {
        ...this.formData,
        userId: userId
      };
      this.apiService.createJob(request).subscribe({
        next: () => {
          this.saving = false;
          this.showMessage('Job created!', 'success');
          setTimeout(() => this.router.navigate(['/employer/jobs']), 1500);
        },
        error: (err) => {
          this.saving = false;
          this.showMessage(err.error || 'Failed to create', 'error');
        }
      });
    }
  }

  private showMessage(msg: string, type: string): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => this.message = '', 3000);
  }
}
