import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { EmpProfileUpdateRequest, Company, CompanyDto } from '../../../core/models/user.model';

@Component({
    selector: 'app-employer-setup',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './setup.component.html',
    styleUrls: ['./setup.component.css']
})
export class EmployerSetupComponent implements OnInit {
    private apiService = inject(ApiService);
    private authService = inject(AuthService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    userId: number | null = null;
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
        const idParam = this.route.snapshot.paramMap.get('userId');
        const loggedInUserId = this.authService.getUserId();

        // Security: Verify the URL param matches the logged-in user's ID
        if (!idParam || !loggedInUserId || +idParam !== loggedInUserId) {
            // If mismatch, redirect to their own setup page or login
            if (loggedInUserId) {
                this.router.navigate(['/employer-setup', loggedInUserId]);
            } else {
                this.router.navigate(['/login']);
            }
            return;
        }

        this.userId = loggedInUserId;

        // Autofill name from registration state if available
        const state = history.state;
        if (state && state.name) {
            this.formData.name = state.name;
        }
        this.loadCompanies();
    }

    loadCompanies(): void {
        this.apiService.getCompaniesForSetup().subscribe({
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
        if (!this.userId) return;

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
            user_id: this.userId,
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

        this.apiService.updateEmployerProfileForSetup(request).subscribe({
            next: () => {
                this.saving = false;
                const status = this.authService.getUserStatus();
                if (status === 'DENIED') {
                    this.showMessage('Profile updated! Returning to status page...', 'success');
                    setTimeout(() => this.router.navigate(['/denied']), 1500);
                } else {
                    this.showMessage('Profile saved! Redirecting...', 'success');
                    setTimeout(() => this.router.navigate(['/employer/pending']), 1500);
                }
            },
            error: (err) => {
                this.saving = false;
                this.showMessage(err.error?.message || 'Failed to save profile', 'error');
            }
        });
    }

    skipSetup(): void {
        this.router.navigate(['/login']);
    }

    private showMessage(msg: string, type: string): void {
        this.message = msg;
        this.messageType = type;
        if (type === 'error') {
            setTimeout(() => this.message = '', 3000);
        }
    }
}
