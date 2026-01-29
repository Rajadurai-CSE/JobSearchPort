import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { EmpProfileUpdateRequest, Company, CompanyDto } from '../../../core/models/user.model';

@Component({
  selector: 'app-employer-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class EmployerProfileComponent implements OnInit {
  private apiService = inject(ApiService);
  private authService = inject(AuthService);

  saving = false;
  loading = true;
  message = '';
  messageType = 'success';

  // Form data
  formData = {
    name: '',
    contactNo: '',
    employerVerificationUrl: ''
  };

  // Company selection
  companies: Company[] = [];
  filteredCompanies: Company[] = [];
  selectedCompany: Company | null = null;
  companySearchQuery = '';
  showCompanyDropdown = false;
  createNewCompany = false;

  // New company form
  newCompany: CompanyDto = {
    companyName: '',
    companyURL: '',
    companyDescription: ''
  };

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.apiService.getAllCompanies().subscribe({
      next: (companies) => {
        this.companies = companies;
        this.filteredCompanies = companies;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onCompanySearch(): void {
    this.showCompanyDropdown = true;
    if (this.companySearchQuery.trim() === '') {
      this.filteredCompanies = this.companies;
    } else {
      this.filteredCompanies = this.companies.filter(c =>
        c.companyName.toLowerCase().includes(this.companySearchQuery.toLowerCase())
      );
    }
  }

  selectCompany(company: Company): void {
    this.selectedCompany = company;
    this.companySearchQuery = company.companyName;
    this.showCompanyDropdown = false;
    this.createNewCompany = false;
  }

  clearCompanySelection(): void {
    this.selectedCompany = null;
    this.companySearchQuery = '';
  }

  toggleNewCompanyForm(): void {
    this.createNewCompany = !this.createNewCompany;
    if (this.createNewCompany) {
      this.selectedCompany = null;
      this.companySearchQuery = '';
    }
  }

  saveProfile(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    if (!this.formData.name.trim()) {
      this.showMessage('Name is required', 'error');
      return;
    }

    // Must have either selected company or new company details
    if (!this.selectedCompany && !this.createNewCompany) {
      this.showMessage('Please select a company or create a new one', 'error');
      return;
    }

    if (this.createNewCompany && !this.newCompany.companyName.trim()) {
      this.showMessage('Company name is required', 'error');
      return;
    }

    this.saving = true;

    const request: EmpProfileUpdateRequest = {
      user_id: userId,
      name: this.formData.name.trim(),
      contactNo: this.formData.contactNo || undefined,
      employerVerificationUrl: this.formData.employerVerificationUrl || undefined
    };

    if (this.selectedCompany) {
      request.companyId = this.selectedCompany.companyId;
    } else if (this.createNewCompany) {
      request.companyDetails = {
        companyName: this.newCompany.companyName.trim(),
        companyURL: this.newCompany.companyURL || undefined,
        companyDescription: this.newCompany.companyDescription || undefined
      };
    }

    this.apiService.updateEmployerProfile(request).subscribe({
      next: () => {
        this.saving = false;
        this.showMessage('Profile updated successfully', 'success');
        // Reload companies if a new one was created
        if (this.createNewCompany) {
          this.loadCompanies();
          this.createNewCompany = false;
        }
      },
      error: (err) => {
        this.saving = false;
        this.showMessage(err.error?.message || 'Failed to update profile', 'error');
      }
    });
  }

  private showMessage(msg: string, type: string): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => this.message = '', 3000);
  }
}
