import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterRequest, LoginRequest } from '../../../core/models/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  role: 'JOB_SEEKER' | 'EMPLOYER' = 'JOB_SEEKER';
  loading = false;
  error = '';
  success = '';

  onSubmit(): void {
    this.error = '';
    this.success = '';

    if (!this.name || !this.email || !this.password) {
      this.error = 'Please fill in all fields';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'Password must be at least 6 characters';
      return;
    }

    this.loading = true;

    const request: RegisterRequest = {
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role
    };

    if (this.role === 'EMPLOYER') {
      // Chain: Register -> Login -> Redirect to Setup
      this.authService.register(request).pipe(
        switchMap((response) => {
          const loginRequest: LoginRequest = { email: this.email, password: this.password };
          return this.authService.login(loginRequest);
        })
      ).subscribe({
        next: () => {
          this.loading = false;
          const userId = this.authService.getUserId();
          this.success = 'Registration successful! Let\'s complete your profile.';
          setTimeout(() => this.router.navigate(['/employer-setup', userId], { state: { name: this.name } }), 1500);
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.message || err.error || 'Registration failed';
        }
      });
    } else {
      // Job Seeker flow (unchanged)
      this.authService.register(request).subscribe({
        next: () => {
          this.loading = false;
          this.success = 'Registration successful! You can now login.';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.message || err.error || 'Registration failed';
        }
      });
    }
  }
}
