import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ApiService } from '../../../core/services/api.service';
import { FlaggedJob } from '../../../core/models/admin.model';

@Component({
    selector: 'app-flagged-jobs',
    standalone: true,
    imports: [CommonModule, NavbarComponent],
    template: `
    <app-navbar></app-navbar>
    <div class="page-container">
      <div class="page-header">
        <h1>Flagged Jobs</h1>
        <p>Review jobs reported by job seekers</p>
      </div>

      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
      </div>

      <div *ngIf="!loading && flaggedJobs.length > 0" class="table-container">
        <table>
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Job ID</th>
              <th>Reporter ID</th>
              <th>Reason</th>
              <th>Reported At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of flaggedJobs">
              <td>{{ item.requestId }}</td>
              <td>{{ item.jobId }}</td>
              <td>{{ item.jobSeekerId }}</td>
              <td>{{ item.reason }}</td>
              <td>{{ item.appliedAt | date:'short' }}</td>
              <td>
                <select class="form-select" style="width: auto; padding: 0.25rem 0.5rem;" (change)="updateAction(item.requestId, $event)">
                  <option value="">Select action...</option>
                  <option value="REVIEWED">Mark Reviewed</option>
                  <option value="REMOVE_JOB">Remove Job</option>
                  <option value="REVOKE_EMPLOYER">Revoke Employer</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="!loading && flaggedJobs.length === 0" class="empty-state">
        <div class="empty-state-icon">✅</div>
        <h3>No flagged jobs</h3>
        <p>All clear!</p>
      </div>
    </div>
  `
})
export class FlaggedJobsComponent implements OnInit {
    flaggedJobs: FlaggedJob[] = [];
    loading = false;

    constructor(private apiService: ApiService) { }

    ngOnInit(): void {
        this.loadFlagged();
    }

    loadFlagged(): void {
        this.loading = true;
        this.apiService.getFlaggedJobs().subscribe({
            next: (data) => {
                this.flaggedJobs = data;
                this.loading = false;
            },
            error: () => this.loading = false
        });
    }

    updateAction(requestId: number, event: Event): void {
        const action = (event.target as HTMLSelectElement).value;
        if (!action) return;

        this.apiService.updateFlaggedJob(requestId, action).subscribe({
            next: () => this.loadFlagged(),
            error: () => alert('Error updating')
        });
    }
}
