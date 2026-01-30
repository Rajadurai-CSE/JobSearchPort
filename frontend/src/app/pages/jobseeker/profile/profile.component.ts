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
    address: '',
    skills: '',
    experience: '',
    education: '',
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
          address: data.address || '',
          skills: data.skills || '',
          experience: data.experience || '',
          education: data.education || '',
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

  saveProfile(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.saving = true;
    const request: JSProfileUpdateRequest = {
      userId,
      name: this.formData.name,
      phoneNo: this.formData.phone,
      address: this.formData.address,
      skills: this.formData.skills,
      experience: this.formData.experience,
      education: this.formData.education,
      resumeUrl: this.formData.resumeUrl
    };

    this.apiService.updateJSProfile(request).subscribe({
      next: (data) => {
        this.profile = data as unknown as JSProfile;
        this.saving = false;
        this.editMode = false;
        this.showMessage('Profile updated successfully', 'success');
      },
      error: () => {
        this.saving = false;
        this.showMessage('Failed to update profile', 'error');
      }
    });
  }

  private showMessage(msg: string, type: string): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => this.message = '', 3000);
  }
}
