import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { ApiService } from '../../../core/services/api.service';
import { FlaggedJobDto } from '../../../core/models/user.model';

@Component({
  selector: 'app-flagged-jobs',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './flagged-jobs.component.html',
  styleUrls: [ './flagged-jobs.component.css']
})
export class FlaggedJobsComponent implements OnInit {
  private apiService = inject(ApiService);

  flaggedJobs: FlaggedJobDto[] = [];
  loading = true;
  message = '';
  messageType = 'success';

  ngOnInit(): void {
    this.loadFlaggedJobs();
  }

  loadFlaggedJobs(): void {
    this.apiService.getFlaggedJobs().subscribe({
      next: (data) => {
        this.flaggedJobs = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  ignoreFlag(item: FlaggedJobDto): void {
    this.apiService.ignoreFlaggedJob(item.requestId).subscribe({
      next: () => {
        item.status = 'IGNORED';
        this.showMessage('Flag ignored', 'success');
      },
      error: () => this.showMessage('Failed to ignore', 'error')
    });
  }

  deleteJob(item: FlaggedJobDto): void {
    if (!confirm('Delete this job?')) return;

    this.apiService.deleteFlaggedJob(item.requestId).subscribe({
      next: () => {
        item.status = 'DELETED';
        this.showMessage('Job deleted', 'success');
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
