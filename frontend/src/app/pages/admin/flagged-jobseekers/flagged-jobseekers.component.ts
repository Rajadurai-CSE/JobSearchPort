import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { ApiService } from '../../../core/services/api.service';
import { DisplayReportedJS } from '../../../core/models/user.model';

@Component({
  selector: 'app-flagged-jobseekers',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './flagged-jobseekers.component.html',
  styleUrls: ['./flagged-jobseekers.component.css']
})
export class FlaggedJobseekersComponent implements OnInit {
  private apiService = inject(ApiService);

  flaggedUsers: DisplayReportedJS[] = [];
  loading = true;
  message = '';
  messageType = 'success';

  // Action modal
  showActionModal = false;
  selectedItem: DisplayReportedJS | null = null;
  actionDescription = '';
  selectedAction = '';

  ngOnInit(): void {
    this.loadFlaggedUsers();
  }

  loadFlaggedUsers(): void {
    this.apiService.getFlaggedJobSeekers().subscribe({
      next: (data) => {
        this.flaggedUsers = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  openActionModal(item: DisplayReportedJS, action: string): void {
    this.selectedItem = item;
    this.selectedAction = action;
    this.actionDescription = '';
    this.showActionModal = true;
  }

  closeActionModal(): void {
    this.showActionModal = false;
    this.selectedItem = null;
    this.actionDescription = '';
    this.selectedAction = '';
  }

  submitAction(): void {
    if (!this.selectedItem) return;

    const actionWithDesc = this.actionDescription.trim()
      ? `${this.selectedAction}: ${this.actionDescription.trim()}`
      : this.selectedAction;

    this.apiService.updateFlaggedJobSeeker(this.selectedItem.requestId, actionWithDesc).subscribe({
      next: (updated) => {
        this.selectedItem!.actionTaken = actionWithDesc;
        this.showMessage(`Action taken: ${this.selectedAction}`, 'success');
        this.closeActionModal();
        this.loadFlaggedUsers();
      },
      error: () => this.showMessage('Failed to take action', 'error')
    });
  }

  revokeUser(item: DisplayReportedJS): void {
    if (!confirm(`Are you sure you want to revoke access for ${item.jobSeekerName || item.jobSeekerEmail}?`)) return;

    this.apiService.revokeUser(item.jobSeekerId).subscribe({
      next: () => {
        this.showMessage('User access revoked', 'success');
        // Update the action taken status
        this.apiService.updateFlaggedJobSeeker(item.requestId, 'REVOKED').subscribe({
          next: () => this.loadFlaggedUsers()
        });
      },
      error: () => this.showMessage('Failed to revoke user', 'error')
    });
  }

  submitActionTaken(item: any): void {
    const actionNote = item.actionNote?.trim();
    if (!actionNote) {
      this.showMessage('Please enter an action taken', 'error');
      return;
    }

    this.apiService.updateFlaggedJobSeeker(item.requestId, actionNote).subscribe({
      next: () => {
        this.showMessage('Action saved successfully', 'success');
        this.loadFlaggedUsers();
      },
      error: () => this.showMessage('Failed to save action', 'error')
    });
  }

  private showMessage(msg: string, type: string): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => this.message = '', 3000);
  }
}

