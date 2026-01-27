import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>💼 Job Portal</h1>
          <p>Create your account</p>
        </div>

        <div class="alert alert-success" *ngIf="successMessage">
          {{ successMessage }}
        </div>

        <div class="alert alert-danger" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>

        <form (ngSubmit)="onSubmit()" *ngIf="!successMessage">
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
              placeholder="Create a password"
              required>
          </div>

          <div class="form-group">
            <label class="form-label">Confirm Password</label>
            <input 
              type="password" 
              class="form-input" 
              [(ngModel)]="confirmPassword" 
              name="confirmPassword" 
              placeholder="Confirm your password"
              required>
          </div>

          <div class="form-group">
            <label class="form-label">I am a</label>
            <select class="form-select" [(ngModel)]="role" name="role" required>
              <option value="">Select your role</option>
              <option value="JOB_SEEKER">Job Seeker - Looking for opportunities</option>
              <option value="EMPLOYER">Employer - Hiring talent</option>
            </select>
          </div>

          <button type="submit" class="btn btn-primary btn-lg" style="width: 100%;" [disabled]="loading">
            {{ loading ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>

        <div class="auth-footer">
          Already have an account? <a routerLink="/login">Sign in</a>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
    email = '';
    password = '';
    confirmPassword = '';
    role: 'JOB_SEEKER' | 'EMPLOYER' | '' = '';
    loading = false;
    errorMessage = '';
    successMessage = '';

    constructor(private authService: AuthService, private router: Router) { }

    onSubmit(): void {
        if (this.password !== this.confirmPassword) {
            this.errorMessage = 'Passwords do not match';
            return;
        }

        if (!this.role) {
            this.errorMessage = 'Please select a role';
            return;
        }

        this.loading = true;
        this.errorMessage = '';

        this.authService.register({
            email: this.email,
            password: this.password,
            role: this.role
        }).subscribe({
            next: (response) => {
                this.loading = false;
                if (this.role === 'EMPLOYER') {
                    this.successMessage = 'Account created! Your employer account is pending approval. You can login to check status.';
                } else {
                    this.successMessage = 'Account created successfully! You can now login.';
                }
                setTimeout(() => {
                    this.router.navigate(['/login']);
                }, 3000);
            },
            error: (error) => {
                this.loading = false;
                this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
            }
        });
    }
}
