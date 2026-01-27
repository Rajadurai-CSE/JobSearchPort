import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="navbar">
      <div class="navbar-brand">
        <a routerLink="/" class="brand-link">
          <span class="brand-icon">💼</span>
          Job Portal
        </a>
      </div>
      
      <div class="navbar-menu" *ngIf="authService.isLoggedIn()">
        <!-- Job Seeker Menu -->
        <ng-container *ngIf="authService.getUserRole() === 'JOB_SEEKER'">
          <a routerLink="/jobseeker/dashboard" class="nav-link">Dashboard</a>
          <a routerLink="/jobseeker/jobs" class="nav-link">Find Jobs</a>
          <a routerLink="/jobseeker/applications" class="nav-link">My Applications</a>
          <a routerLink="/jobseeker/bookmarks" class="nav-link">Bookmarks</a>
          <a routerLink="/jobseeker/profile" class="nav-link">Profile</a>
        </ng-container>

        <!-- Employer Menu -->
        <ng-container *ngIf="authService.getUserRole() === 'EMPLOYER'">
          <a routerLink="/employer/dashboard" class="nav-link">Dashboard</a>
          <a routerLink="/employer/jobs" class="nav-link">My Jobs</a>
          <a routerLink="/employer/profile" class="nav-link">Profile</a>
        </ng-container>

        <!-- Admin Menu -->
        <ng-container *ngIf="authService.getUserRole() === 'ADMIN'">
          <a routerLink="/admin/dashboard" class="nav-link">Dashboard</a>
          <a routerLink="/admin/users" class="nav-link">Users</a>
          <a routerLink="/admin/employers" class="nav-link">Employers</a>
          <a routerLink="/admin/flagged-jobseekers" class="nav-link">Flagged Job Seekers</a>
          <a routerLink="/admin/flagged-jobs" class="nav-link">Flagged Jobs</a>
        </ng-container>
      </div>

      <div class="navbar-end">
        <ng-container *ngIf="authService.isLoggedIn(); else loginLinks">
          <span class="user-info">{{ authService.getUser()?.email }}</span>
          <button class="btn btn-outline" (click)="logout()">Logout</button>
        </ng-container>
        <ng-template #loginLinks>
          <a routerLink="/login" class="btn btn-outline">Login</a>
          <a routerLink="/register" class="btn btn-primary">Sign Up</a>
        </ng-template>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background: linear-gradient(135deg, #1e3a5f 0%, #2d5a8c 100%);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .navbar-brand {
      display: flex;
      align-items: center;
    }

    .brand-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.5rem;
      font-weight: 700;
      color: #fff;
      text-decoration: none;
    }

    .brand-icon {
      font-size: 1.8rem;
    }

    .navbar-menu {
      display: flex;
      gap: 1.5rem;
    }

    .nav-link {
      color: rgba(255, 255, 255, 0.85);
      text-decoration: none;
      font-weight: 500;
      padding: 0.5rem 0;
      transition: color 0.2s, border-color 0.2s;
      border-bottom: 2px solid transparent;
    }

    .nav-link:hover {
      color: #fff;
      border-bottom-color: #4ecdc4;
    }

    .navbar-end {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-info {
      color: rgba(255, 255, 255, 0.9);
      font-size: 0.9rem;
    }

    .btn {
      padding: 0.5rem 1.25rem;
      border-radius: 8px;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
    }

    .btn-outline {
      background: transparent;
      border: 2px solid rgba(255, 255, 255, 0.7);
      color: #fff;
    }

    .btn-outline:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: #fff;
    }

    .btn-primary {
      background: linear-gradient(135deg, #4ecdc4 0%, #45b7aa 100%);
      color: #1e3a5f;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(78, 205, 196, 0.4);
    }
  `]
})
export class NavbarComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
