import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-job-form',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
    template: `
    <app-navbar></app-navbar>
    <div class="page-container">
      <a routerLink="/employer/jobs" class="btn btn-outline mb-3">← Back to Jobs</a>
      
      <div class="card" style="max-width: 800px;">
        <h2>{{ isEdit ? 'Edit Job' : 'Post New Job' }}</h2>

        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label class="form-label">Job Title *</label>
            <input type="text" class="form-input" [(ngModel)]="job.title" name="title" placeholder="e.g., Senior Software Engineer" required>
          </div>

          <div class="form-group">
            <label class="form-label">Description *</label>
            <textarea class="form-textarea" [(ngModel)]="job.description" name="description" placeholder="Describe the role, responsibilities..." required></textarea>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Location *</label>
              <input type="text" class="form-input" [(ngModel)]="job.location" name="location" placeholder="e.g., Remote, New York" required>
            </div>

            <div class="form-group">
              <label class="form-label">Employment Type</label>
              <select class="form-select" [(ngModel)]="job.employmentType" name="employmentType">
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Salary Range</label>
              <input type="text" class="form-input" [(ngModel)]="job.salaryRange" name="salaryRange" placeholder="e.g., $80,000 - $120,000">
            </div>

            <div class="form-group">
              <label class="form-label">Min. Experience (years)</label>
              <input type="number" class="form-input" [(ngModel)]="job.minimumExperience" name="minimumExperience" placeholder="0">
            </div>

            <div class="form-group">
              <label class="form-label">Number of Vacancies</label>
              <input type="number" class="form-input" [(ngModel)]="job.noOfVacancies" name="noOfVacancies" placeholder="1">
            </div>

            <div class="form-group">
              <label class="form-label">Application Deadline</label>
              <input type="date" class="form-input" [(ngModel)]="job.applicationDeadline" name="applicationDeadline">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Required Skills (comma-separated)</label>
            <input type="text" class="form-input" [(ngModel)]="job.requiredSkills" name="requiredSkills" placeholder="e.g., JavaScript, Angular, Node.js">
          </div>

          <button type="submit" class="btn btn-primary btn-lg" [disabled]="saving">
            {{ saving ? 'Saving...' : (isEdit ? 'Update Job' : 'Post Job') }}
          </button>
        </form>

        <div *ngIf="message" class="alert mt-3" [ngClass]="messageType === 'success' ? 'alert-success' : 'alert-danger'">
          {{ message }}
        </div>
      </div>
    </div>
  `
})
export class JobFormComponent implements OnInit {
    job: any = {
        title: '',
        description: '',
        location: '',
        employmentType: 'Full-time',
        salaryRange: '',
        minimumExperience: 0,
        noOfVacancies: 1,
        applicationDeadline: '',
        requiredSkills: ''
    };
    isEdit = false;
    jobId: number | null = null;
    saving = false;
    message = '';
    messageType = 'success';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private apiService: ApiService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEdit = true;
            this.jobId = +id;
            // Load job for editing - simplified for now
        }
    }

    onSubmit(): void {
        const userId = this.authService.getUserId();
        if (!userId) return;

        this.saving = true;
        this.job.userId = userId;

        if (this.isEdit && this.jobId) {
            this.apiService.updateJob(this.jobId, userId, this.job).subscribe({
                next: () => {
                    this.saving = false;
                    this.showMessage('Job updated successfully!', 'success');
                    setTimeout(() => this.router.navigate(['/employer/jobs']), 1500);
                },
                error: () => {
                    this.saving = false;
                    this.showMessage('Error updating job', 'error');
                }
            });
        } else {
            this.apiService.createJob(this.job).subscribe({
                next: () => {
                    this.saving = false;
                    this.showMessage('Job posted successfully!', 'success');
                    setTimeout(() => this.router.navigate(['/employer/jobs']), 1500);
                },
                error: () => {
                    this.saving = false;
                    this.showMessage('Error posting job', 'error');
                }
            });
        }
    }

    private showMessage(msg: string, type: string): void {
        this.message = msg;
        this.messageType = type;
    }
}
