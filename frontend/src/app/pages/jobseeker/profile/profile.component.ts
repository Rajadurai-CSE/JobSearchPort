import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { JSProfile, JSProfileUpdateRequest } from '../../../core/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private apiService = inject(ApiService);
  authService = inject(AuthService);

  profile: JSProfile | null = null;
  loading = true;
  saving = false;
  message = '';
  messageType = 'success';
  editMode = false;

  formData = {
    name: '',
    phone: '',
    location: '',
    skills: '',
    experience: 0,
    certifications: '',
    resumeUrl: ''
  };

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.apiService.getJSProfile(userId).subscribe({
      next: (data) => {
        this.profile = data;
        this.formData = {
          name: data.name || '',
          phone: data.phoneNo || '',
          location: data.location || '',
          skills: data.skills || '',
          experience: data.experience || 0,
          certifications: data.certifications || '',
          resumeUrl: data.resumeUrl || ''
        };
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  toggleEdit(): void {
    this.editMode = !this.editMode;
  }

  validateForm(): string | null {
    if (!this.formData.name.trim()) {
      return 'Name is required';
    }
    if (this.formData.experience < 0) {
      return 'Experience cannot be negative';
    }
    return null;
  }

  saveProfile(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    const validationError = this.validateForm();
    if (validationError) {
      this.showMessage(validationError, 'error');
      return;
    }

    this.saving = true;
    const request: JSProfileUpdateRequest = {
      userId,
      name: this.formData.name.trim(),
      phoneNo: this.formData.phone.trim(),
      location: this.formData.location.trim(),
      skills: this.formData.skills.trim(),
      experience: this.formData.experience,
      certifications: this.formData.certifications.trim(),
      resumeUrl: this.formData.resumeUrl.trim()
    };

    this.apiService.updateJSProfile(request).subscribe({
      next: (data) => {
        this.profile = data as unknown as JSProfile;
        this.saving = false;
        this.editMode = false;
        this.showMessage('Profile updated successfully', 'success');
        this.loadProfile(); // Reload to sync data
      },
      error: (err) => {
        this.saving = false;
        const errorMsg = err.error?.message || 'Failed to update profile. Please check all fields.';
        this.showMessage(errorMsg, 'error');
      }
    });
  }

  private showMessage(msg: string, type: string): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => this.message = '', 4000);
  }
}

