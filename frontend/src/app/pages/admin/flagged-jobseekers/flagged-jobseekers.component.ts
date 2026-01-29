import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { ApiService } from '../../../core/services/api.service';
import { DisplayReportedJS } from '../../../core/models/user.model';

@Component({
  selector: 'app-flagged-jobseekers',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './flagged-jobseekers.component.html',
  styleUrls: [ './flagged-jobseekers.component.css']
})
export class FlaggedJobseekersComponent implements OnInit {
  private apiService = inject(ApiService);

  flaggedUsers: DisplayReportedJS[] = [];
  loading = true;
  message = '';
  messageType = 'success';

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

  takeAction(item: DisplayReportedJS, action: string): void {
    this.apiService.updateFlaggedJobSeeker(item.requestId, action).subscribe({
      next: (updated) => {
        item.actionTaken = action;
        this.showMessage(`Action taken: ${action}`, 'success');
      },
      error: () => this.showMessage('Failed to take action', 'error')
    });
  }

  private showMessage(msg: string, type: string): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => this.message = '', 3000);
  }
}
