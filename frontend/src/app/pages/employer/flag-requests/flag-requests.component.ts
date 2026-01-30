import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { FlaggedJobSeekerRequest } from '../../../core/models/job.model';

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

    flagRequests: FlaggedJobSeekerRequest[] = [];
    loading = true;

    ngOnInit(): void {
        this.loadFlagRequests();
    }

    loadFlagRequests(): void {
        const userId = this.authService.getUserId();
        if (!userId) return;

        this.apiService.getMyFlagRequests(userId).subscribe({
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
        if (!status || status === 'PENDING') return 'badge-warning';
        return 'badge-success';
    }

    getStatusLabel(status: string): string {
        if (!status || status === 'PENDING') return 'Pending Review';
        return status;
    }
}
