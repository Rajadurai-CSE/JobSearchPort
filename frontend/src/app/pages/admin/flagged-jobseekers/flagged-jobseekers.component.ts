import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ApiService } from '../../../core/services/api.service';

@Component({
    selector: 'app-flagged-jobseekers',
    standalone: true,
    imports: [CommonModule, NavbarComponent],
    template: `
    <app-navbar></app-navbar>
    <div class="page-container">
      <div class="page-header">
        <h1>Flagged Job Seekers</h1>
        <p>Review job seekers flagged by employers</p>
      </div>

      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
      </div>

      <div *ngIf="!loading && flaggedItems.length > 0" class="table-container">
        <table>
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Job Seeker ID</th>
              <th>Email</th>
              <th>Reason</th>
              <th>Reported At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of flaggedItems">
              <td>{{ item.requestId }}</td>
              <td>{{ item.jobSeekerId }}</td>
              <td>{{ item.jobSeekerEmail }}</td>
              <td>{{ item.reason }}</td>
              <td>{{ item.appliedAt | date:'short' }}</td>
              <td>
                <select class="form-select" style="width: auto; padding: 0.25rem 0.5rem;" (change)="updateAction(item.requestId, $event)">
                  <option value="">Select action...</option>
                  <option value="REVIEWED">Mark Reviewed</option>
                  <option value="WARNED">Issue Warning</option>
                  <option value="REVOKED">Revoke User</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="!loading && flaggedItems.length === 0" class="empty-state">
        <div class="empty-state-icon">✅</div>
        <h3>No flagged job seekers</h3>
        <p>All clear!</p>
      </div>
    </div>
  `
})
export class FlaggedJobSeekersComponent implements OnInit {
    flaggedItems: any[] = [];
    loading = false;

    constructor(private apiService: ApiService) { }

    ngOnInit(): void {
        this.loadFlagged();
    }

    loadFlagged(): void {
        this.loading = true;
        this.apiService.getFlaggedJobSeekers().subscribe({
            next: (data) => {
                this.flaggedItems = data;
                this.loading = false;
            },
            error: () => this.loading = false
        });
    }

    updateAction(requestId: number, event: Event): void {
        const action = (event.target as HTMLSelectElement).value;
        if (!action) return;

        this.apiService.updateFlaggedJobSeeker(requestId, action).subscribe({
            next: () => this.loadFlagged(),
            error: () => alert('Error updating')
        });
    }
}
