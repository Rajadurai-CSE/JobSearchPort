import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-revoked',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './revoked.component.html',
  styleUrls: [ './revoked.component.css']
})
export class RevokedComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
