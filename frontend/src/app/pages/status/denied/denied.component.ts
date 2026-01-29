import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-denied',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './denied.component.html',
  styleUrls: [ './denied.component.css']
})
export class DeniedComponent {
  private router = inject(Router);

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
