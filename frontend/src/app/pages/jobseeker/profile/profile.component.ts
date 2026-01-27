import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { JobSeekerProfile } from '../../../core/models/jobseeker.model';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, FormsModule, NavbarComponent],
    template: `
    <app-navbar></app-navbar>
    <div class="page-container">
      <div class="page-header">
        <h1>👤 My Profile</h1>
        <p>Manage your profile information</p>
      </div>

      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
      </div>

      <div *ngIf="!loading && profile" class="card" style="max-width: 800px;">
        <form (ngSubmit)="saveProfile()">
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input type="text" class="form-input" [(ngModel)]="profile.name" name="name" placeholder="Your full name">
            </div>

            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" class="form-input" [value]="profile.email" disabled>
            </div>

            <div class="form-group">
              <label class="form-label">Date of Birth</label>
              <input type="text" class="form-input" [(ngModel)]="profile.dob" name="dob" placeholder="DD/MM/YYYY">
            </div>

            <div class="form-group">
              <label class="form-label">Phone Number</label>
              <input type="tel" class="form-input" [(ngModel)]="profile.phoneNo" name="phoneNo" placeholder="+1 234 567 8900">
            </div>

            <div class="form-group">
              <label class="form-label">Location</label>
              <input type="text" class="form-input" [(ngModel)]="profile.location" name="location" placeholder="City, Country">
            </div>

            <div class="form-group">
              <label class="form-label">Years of Experience</label>
              <input type="number" class="form-input" [(ngModel)]="profile.experience" name="experience" placeholder="0">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Skills (comma-separated)</label>
            <input type="text" class="form-input" [(ngModel)]="profile.skills" name="skills" placeholder="JavaScript, Angular, Java, Spring Boot">
          </div>

          <div class="form-group">
            <label class="form-label">Resume URL</label>
            <input type="url" class="form-input" [(ngModel)]="profile.resumeUrl" name="resumeUrl" placeholder="https://drive.google.com/...">
          </div>

          <div class="form-group">
            <label class="form-label">Certifications</label>
            <input type="text" class="form-input" [(ngModel)]="profile.certifications" name="certifications" placeholder="AWS Certified, Google Cloud...">
          </div>

          <div class="form-group">
            <label class="form-label">Certifications URL</label>
            <input type="url" class="form-input" [(ngModel)]="profile.certificationsUrl" name="certificationsUrl" placeholder="https://...">
          </div>

          <button type="submit" class="btn btn-primary btn-lg" [disabled]="saving">
            {{ saving ? 'Saving...' : 'Save Profile' }}
          </button>
        </form>

        <div *ngIf="message" class="alert mt-3" [ngClass]="messageType === 'success' ? 'alert-success' : 'alert-danger'">
          {{ message }}
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
    profile: JobSeekerProfile | null = null;
    loading = false;
    saving = false;
    message = '';
    messageType = 'success';

    constructor(private apiService: ApiService, private authService: AuthService) { }

    ngOnInit(): void {
        this.loadProfile();
    }

    loadProfile(): void {
        const userId = this.authService.getUserId();
        if (!userId) return;

        this.loading = true;
        this.apiService.getJobSeekerProfile(userId).subscribe({
            next: (data) => {
                this.profile = data;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                // Initialize empty profile
                this.profile = {
                    userId: userId,
                    email: this.authService.getUser()?.email || '',
                    name: '',
                    dob: '',
                    location: '',
                    phoneNo: '',
                    skills: '',
                    experience: 0,
                    resumeUrl: '',
                    certifications: '',
                    certificationsUrl: ''
                };
            }
        });
    }

    saveProfile(): void {
        if (!this.profile) return;

        this.saving = true;
        this.apiService.updateJobSeekerProfile(this.profile).subscribe({
            next: (data) => {
                this.profile = data;
                this.saving = false;
                this.showMessage('Profile saved successfully!', 'success');
            },
            error: () => {
                this.saving = false;
                this.showMessage('Error saving profile', 'error');
            }
        });
    }

    private showMessage(msg: string, type: string): void {
        this.message = msg;
        this.messageType = type;
        setTimeout(() => this.message = '', 3000);
    }
}
