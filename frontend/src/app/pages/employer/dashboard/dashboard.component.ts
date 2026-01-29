import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { Job } from '../../../core/models/job.model';

@Component({
  selector: 'app-employer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css']
})
export class EmployerDashboardComponent implements OnInit {
  private apiService = inject(ApiService);
  private authService = inject(AuthService);

  jobs: Job[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.apiService.getEmployerJobs(userId).subscribe({
      next: (data) => {
        this.jobs = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  get activeJobsCount(): number {
    return this.jobs.length;
  }
}
