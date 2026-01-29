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
    this.apiService.getJobDetails(jobId).subscribe({
      next: (job) => {
        this.formData = {
          title: job.title,
          description: job.description,
          location: job.location,
          requiredSkills: job.requiredSkills,
          salaryRange: job.salaryRange,
          noOfVacancies: job.noOfVacancies,
          minimumExperience: job.minimumExperience,
          employmentType: job.employmentType,
          applicationDeadline: job.applicationDeadline?.split('T')[0] || ''
        };
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  onSubmit(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.saving = true;

    if (this.isEditMode && this.jobId) {
      const request: JobUpdateRequest = { ...this.formData };
      this.apiService.updateJob(this.jobId, userId, request).subscribe({
        next: () => {
          this.saving = false;
          this.showMessage('Job updated!', 'success');
          setTimeout(() => this.router.navigate(['/employer/jobs']), 1500);
        },
        error: () => {
          this.saving = false;
          this.showMessage('Failed to update', 'error');
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
        error: () => {
          this.saving = false;
          this.showMessage('Failed to create', 'error');
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
