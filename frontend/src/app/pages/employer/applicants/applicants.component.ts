import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
    selector: 'app-applicants',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
    template: `
    <app-navbar></app-navbar>
    <div class="page-container">
      <a routerLink="/employer/jobs" class="btn btn-outline mb-3">← Back to Jobs</a>
      
      <div class="page-header">
        <h1>Job Applicants</h1>
        <p>Manage applicants for this position</p>
      </div>

      <div class="empty-state">
        <div class="empty-state-icon">👥</div>
        <h3>No applicants yet</h3>
        <p>Applicants will appear here once they apply to your job posting</p>
      </div>
    </div>
  `
})
export class ApplicantsComponent implements OnInit {
    jobId: number | null = null;

    constructor(private route: ActivatedRoute) { }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('jobId');
        if (id) {
            this.jobId = +id;
        }
    }
}
