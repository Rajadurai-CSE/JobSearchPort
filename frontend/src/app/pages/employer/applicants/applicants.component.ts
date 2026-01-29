import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { EmployerJobApplication, JobApplicationUpdate, FlagUserRequest } from '../../../core/models/job.model';

@Component({
  selector: 'app-applicants',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  templateUrl: './applicants.component.html',
  styleUrls: ['./applicants.component.css']
})
export class ApplicantsComponent implements OnInit {
  private apiService = inject(ApiService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  jobId: number | null = null;
  applicants: EmployerJobApplication[] = [];
  loading = true;
  message = '';
  messageType = 'success';

  // Flag modal
  showFlagModal = false;
  selectedApplicant: EmployerJobApplication | null = null;
  flagReason = '';

  stages = ['APPLIED', 'SHORTLISTED', 'INTERVIEW', 'HIRED', 'REJECTED'];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('jobId');
    if (id) {
      this.jobId = +id;
      this.loadApplicants(this.jobId);
    }
  }

  loadApplicants(jobId: number): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.apiService.getJobApplications(jobId, userId).subscribe({
      next: (data) => {
        this.applicants = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  updateStatus(applicant: EmployerJobApplication, newStage: string): void {
    if (!this.jobId) return;

    const request: JobApplicationUpdate = {
      jobId: this.jobId,
      jobSeekerId: applicant.jobSeekerId,
      stage: newStage
    };

    this.apiService.updateApplicantStatus(request).subscribe({
      next: () => {
        applicant.stage = newStage;
        this.showMessage('Status updated', 'success');
      },
      error: () => this.showMessage('Failed to update', 'error')
    });
  }

  openFlagModal(applicant: EmployerJobApplication): void {
    this.selectedApplicant = applicant;
    this.showFlagModal = true;
  }

  closeFlagModal(): void {
    this.showFlagModal = false;
    this.selectedApplicant = null;
    this.flagReason = '';
  }

  submitFlag(): void {
    if (!this.selectedApplicant || !this.flagReason.trim()) return;
    const userId = this.authService.getUserId();
    if (!userId) return;

    const request: FlagUserRequest = {
      employerId: userId,
      jobseeker_id: this.selectedApplicant.jobSeekerId,
      reason: this.flagReason
    };

    this.apiService.flagUser(request).subscribe({
      next: () => {
        this.showMessage('User reported', 'success');
        this.closeFlagModal();
      },
      error: () => this.showMessage('Failed to report', 'error')
    });
  }

  getStageClass(stage: string): string {
    switch (stage) {
      case 'APPLIED': return 'badge-info';
      case 'SHORTLISTED': return 'badge-warning';
      case 'INTERVIEW': return 'badge-primary';
      case 'HIRED': return 'badge-success';
      case 'REJECTED': return 'badge-danger';
      default: return 'badge-secondary';
    }
  }

  private showMessage(msg: string, type: string): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => this.message = '', 3000);
  }
}
