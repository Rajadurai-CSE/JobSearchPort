import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { Application, Bookmark } from '../../../core/models/job.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private apiService = inject(ApiService);
  private authService = inject(AuthService);

  applications: Application[] = [];
  bookmarks: Bookmark[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.apiService.getApplications(userId).subscribe({
      next: (data) => {
        this.applications = data.slice(0, 5);
        this.loading = false;
      },
      error: () => this.loading = false
    });

    this.apiService.getBookmarks(userId).subscribe({
      next: (data) => this.bookmarks = data.slice(0, 5),
      error: () => { }
    });
  }

  get appliedCount(): number {
    return this.applications.filter(a => a.stage === 'APPLIED').length;
  }

  get interviewCount(): number {
    return this.applications.filter(a => a.stage === 'INTERVIEW').length;
  }
}
