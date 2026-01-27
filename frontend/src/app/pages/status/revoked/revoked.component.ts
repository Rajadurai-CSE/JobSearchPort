import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-revoked',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="auth-container">
      <div class="auth-card text-center">
        <div style="font-size: 4rem; margin-bottom: 1rem;">🚫</div>
        <h2>Account Revoked</h2>
        <p class="text-muted">
          Your account has been revoked due to policy violations. 
          Please contact support if you believe this is an error.
        </p>
        <button class="btn btn-outline mt-3" (click)="logout()">Logout</button>
      </div>
    </div>
  `
})
export class RevokedComponent {
    constructor(private authService: AuthService, private router: Router) { }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
