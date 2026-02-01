import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-denied',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './denied.component.html',
  styleUrls: ['./denied.component.css']
})
export class DeniedComponent {
  private router = inject(Router);
  private apiService = inject(ApiService);
  authService = inject(AuthService);

  loading = false;
  error = '';
  success = '';
  userId: number | null = null;

  constructor() {
    this.userId = this.authService.getUserId();
  }

  goToLogin(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToProfile(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.router.navigate(['/employer-setup', userId]);
    }
  }

  reapply(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.error = 'User not found. Please login again.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    this.apiService.reapplyForVerification(userId).subscribe({
      next: (response) => {
        this.loading = false;
        this.success = response;
        // After reapply, redirect to pending page
        setTimeout(() => {
          this.router.navigate(['/employer/pending']);
        }, 2000);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error || 'Failed to submit re-application';
      }
    });
  }
}
