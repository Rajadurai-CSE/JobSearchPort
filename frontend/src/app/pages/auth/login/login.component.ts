import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  loading = false;
  error = '';

  onSubmit(form: any): void {

    if (form.invalid) {
      this.error = 'Please enter a valid email and password';
      return;
    }

    if (!this.email || !this.password) {
      this.error = 'Please fill in all fields';
      return;
    }

    this.loading = true;
    this.error = '';

    const request: LoginRequest = {
      email: this.email,
      password: this.password
    };

    this.authService.login(request).subscribe({
      next: () => {
        this.loading = false;
        this.navigateBasedOnRole();
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Invalid credentials';
      }
    });
  }

  private navigateBasedOnRole(): void {
    const role = this.authService.getUserRole();
    const status = this.authService.getUserStatus();

    // Check for revoked status first
    if (status === 'REVOKED') {
      this.router.navigate(['/revoked']);
      return;
    }

    // Check for denied status - allow user to see denied page and re-apply
    if (status === 'DENIED') {
      this.router.navigate(['/denied']);
      return;
    }

    switch (role) {
      case 'ADMIN':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'EMPLOYER':
        if (status === 'PENDING') {
          this.router.navigate(['/employer/pending']);
        } else {
          this.router.navigate(['/employer/dashboard']);
        }
        break;
      case 'JOB_SEEKER':
      default:
        this.router.navigate(['/jobseeker/dashboard']);
        break;
    }
  }
}
