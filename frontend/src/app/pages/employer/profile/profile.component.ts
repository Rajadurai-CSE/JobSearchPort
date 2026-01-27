import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-employer-profile',
    standalone: true,
    imports: [CommonModule, FormsModule, NavbarComponent],
    template: `
    <app-navbar></app-navbar>
    <div class="page-container">
      <div class="page-header">
        <h1>Employer Profile</h1>
        <p>Manage your company information</p>
      </div>

      <div class="card" style="max-width: 800px;">
        <form (ngSubmit)="saveProfile()">
          <h3>Personal Information</h3>
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input type="text" class="form-input" [(ngModel)]="profile.name" name="name" placeholder="Your name">
            </div>
            <div class="form-group">
              <label class="form-label">Contact Number</label>
              <input type="tel" class="form-input" [(ngModel)]="profile.contactNo" name="contactNo" placeholder="+1 234 567 8900">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Verification Document URL</label>
            <input type="url" class="form-input" [(ngModel)]="profile.employerVerificationUrl" name="employerVerificationUrl" placeholder="https://...">
          </div>

          <hr style="margin: 2rem 0;">
          
          <h3>Company Information</h3>
          <div class="form-group">
            <label class="form-label">Company Name</label>
            <input type="text" class="form-input" [(ngModel)]="profile.companyName" name="companyName" placeholder="Your company name">
          </div>
          <div class="form-group">
            <label class="form-label">Company Website</label>
            <input type="url" class="form-input" [(ngModel)]="profile.companyURL" name="companyURL" placeholder="https://yourcompany.com">
          </div>
          <div class="form-group">
            <label class="form-label">Company Description</label>
            <textarea class="form-textarea" [(ngModel)]="profile.companyDescription" name="companyDescription" placeholder="Describe your company..."></textarea>
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
export class EmployerProfileComponent implements OnInit {
    profile: any = {
        userId: null,
        name: '',
        contactNo: '',
        employerVerificationUrl: '',
        companyName: '',
        companyURL: '',
        companyDescription: ''
    };
    saving = false;
    message = '';
    messageType = 'success';

    constructor(private apiService: ApiService, private authService: AuthService) { }

    ngOnInit(): void {
        const userId = this.authService.getUserId();
        if (userId) {
            this.profile.userId = userId;
        }
    }

    saveProfile(): void {
        this.saving = true;

        const payload = {
            userId: this.profile.userId,
            name: this.profile.name,
            contactNo: this.profile.contactNo,
            employerVerificationUrl: this.profile.employerVerificationUrl,
            companyDetails: {
                companyName: this.profile.companyName,
                companyURL: this.profile.companyURL,
                companyDescription: this.profile.companyDescription
            }
        };

        this.apiService.updateEmployerProfile(payload).subscribe({
            next: () => {
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
