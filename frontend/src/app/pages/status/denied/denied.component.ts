import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-denied',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="auth-container">
      <div class="auth-card text-center">
        <div style="font-size: 4rem; margin-bottom: 1rem;">❌</div>
        <h2>Registration Denied</h2>
        <p class="text-muted">
          Unfortunately, your registration has been denied by our admin team.
          Please contact support for more information.
        </p>
        <button class="btn btn-outline mt-3" (click)="logout()">Logout</button>
      </div>
    </div>
  `
})
export class DeniedComponent {
    constructor(private authService: AuthService, private router: Router) { }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
