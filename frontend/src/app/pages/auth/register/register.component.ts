import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterRequest } from '../../../core/models/auth.model';

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

    this.authService.register(request).subscribe({
      next: (response) => {
        this.loading = false;
        if (this.role === 'EMPLOYER') {
          this.success = 'Registration successful! Let\'s complete your profile.';
          setTimeout(() => this.router.navigate(['/employer-setup', response.userId]), 1500);
        } else {
          this.success = 'Registration successful! You can now login.';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Registration failed';
      }
    });
  }
}
