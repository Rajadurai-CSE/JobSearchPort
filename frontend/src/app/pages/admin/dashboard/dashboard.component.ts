import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { ApiService } from '../../../core/services/api.service';
import { SystemStatistics } from '../../../core/models/user.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  private apiService = inject(ApiService);

  stats: SystemStatistics | null = null;
  loading = true;

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.apiService.getSystemStatistics().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
}
