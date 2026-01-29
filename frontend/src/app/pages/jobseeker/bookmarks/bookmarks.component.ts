import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { Bookmark } from '../../../core/models/job.model';

@Component({
  selector: 'app-bookmarks',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.css']
})
export class BookmarksComponent implements OnInit {
  private apiService = inject(ApiService);
  private authService = inject(AuthService);

  bookmarks: Bookmark[] = [];
  loading = true;
  message = '';
  messageType = 'success';

  // Apply modal
  showApplyModal = false;
  selectedJobId: number | null = null;
  selectedJobTitle = '';
  resumeUrl = '';

  ngOnInit(): void {
    this.loadBookmarks();
  }

  loadBookmarks(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.apiService.getBookmarks(userId).subscribe({
      next: (data) => {
        this.bookmarks = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  removeBookmark(bookmarkId: number): void {
    this.apiService.removeBookmark(bookmarkId).subscribe({
      next: () => {
        this.showMessage('Bookmark removed', 'success');
        this.bookmarks = this.bookmarks.filter(b => b.bookmarkId !== bookmarkId);
      },
      error: () => this.showMessage('Failed to remove', 'error')
    });
  }

  openApplyModal(jobId: number, jobTitle: string): void {
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

    this.apiService.applyForJob(this.selectedJobId, userId, this.resumeUrl).subscribe({
      next: () => {
        this.showMessage('Applied successfully!', 'success');
        this.closeApplyModal();
      },
      error: (err) => this.showMessage(err.error || 'Failed to apply', 'error')
    });
  }

  private showMessage(msg: string, type: string): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => this.message = '', 3000);
  }
}
