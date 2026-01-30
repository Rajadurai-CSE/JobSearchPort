import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { FlaggedJobStatus } from '../../../core/models/job.model';

@Component({
    selector: 'app-flag-requests',
    standalone: true,
    imports: [CommonModule, RouterLink, NavbarComponent],
    templateUrl: './flag-requests.component.html',
    styleUrls: ['./flag-requests.component.css']
})
export class FlagRequestsComponent implements OnInit {
    private apiService = inject(ApiService);
    private authService = inject(AuthService);

    flagRequests: FlaggedJobStatus[] = [];
    loading = true;

    ngOnInit(): void {
        this.loadFlagRequests();
    }

    loadFlagRequests(): void {
        const userId = this.authService.getUserId();
        if (!userId) return;

        this.apiService.getFlaggedJobStatus(userId).subscribe({
            next: (data) => {
                this.flagRequests = data;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'PENDING': return 'badge-warning';
            case 'DELETED': return 'badge-success';
            case 'IGNORED': return 'badge-danger';
            default: return 'badge-secondary';
        }
    }

    getStatusLabel(status: string): string {
        switch (status) {
            case 'PENDING': return 'Pending Review';
            case 'DELETED': return 'Job Removed';
            case 'IGNORED': return 'Request Ignored';
            default: return status;
        }
    }
}
