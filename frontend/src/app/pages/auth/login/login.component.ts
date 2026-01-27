import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>💼 Job Portal</h1>
          <p>Sign in to your account</p>
        </div>

        <div class="alert alert-danger" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>

        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label class="form-label">Email</label>
            <input 
              type="email" 
              class="form-input" 
              [(ngModel)]="email" 
              name="email" 
              placeholder="Enter your email"
              required>
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <input 
              type="password" 
              class="form-input" 
              [(ngModel)]="password" 
              name="password" 
              placeholder="Enter your password"
              required>
          </div>

          <button type="submit" class="btn btn-primary btn-lg" style="width: 100%;" [disabled]="loading">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <div class="auth-footer">
          Don't have an account? <a routerLink="/register">Sign up</a>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
    email = '';
    password = '';
    loading = false;
    errorMessage = '';

    constructor(private authService: AuthService, private router: Router) { }

    onSubmit(): void {
        this.loading = true;
        this.errorMessage = '';

        this.authService.login({ email: this.email, password: this.password }).subscribe({
            next: (response) => {
                this.loading = false;

                // Navigate based on role
                switch (response.role) {
                    case 'ADMIN':
                        this.router.navigate(['/admin/dashboard']);
                        break;
                    case 'EMPLOYER':
                        if (response.status === 'PENDING') {
                            this.router.navigate(['/employer/pending']);
                        } else if (response.status === 'APPROVED') {
                            this.router.navigate(['/employer/dashboard']);
                        } else {
                            this.errorMessage = response.message;
                        }
                        break;
                    case 'JOB_SEEKER':
                        this.router.navigate(['/jobseeker/dashboard']);
                        break;
                    default:
                        this.router.navigate(['/']);
                }
            },
            error: (error) => {
                this.loading = false;
                this.errorMessage = error.error?.message || 'Login failed. Please try again.';
            }
        });
    }
}
