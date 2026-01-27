import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ApiService } from '../../../core/services/api.service';
import { DisplayEmployerProfile } from '../../../core/models/admin.model';

@Component({
    selector: 'app-employers',
    standalone: true,
    imports: [CommonModule, NavbarComponent],
    template: `
    <app-navbar></app-navbar>
    <div class="page-container">
      <div class="page-header">
        <h1>Employer Approvals</h1>
        <p>Review and approve employer registrations</p>
      </div>

      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
      </div>

      <div *ngIf="!loading" class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Name</th>
              <th>Company</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let emp of employers">
              <td>{{ emp.userId }}</td>
              <td>{{ emp.email }}</td>
              <td>{{ emp.name || '-' }}</td>
              <td>{{ emp.companyName || '-' }}</td>
              <td><span class="badge" [ngClass]="getStatusClass(emp.status)">{{ emp.status }}</span></td>
              <td>
                <div class="flex gap-1" *ngIf="emp.status === 'PENDING'">
                  <button class="btn btn-success btn-sm" (click)="approve(emp.userId)">Approve</button>
                  <button class="btn btn-danger btn-sm" (click)="deny(emp.userId)">Deny</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="message" class="alert" [ngClass]="messageType === 'success' ? 'alert-success' : 'alert-danger'" style="position: fixed; bottom: 20px; right: 20px;">
        {{ message }}
      </div>
    </div>
  `
})
export class EmployersComponent implements OnInit {
    employers: DisplayEmployerProfile[] = [];
    loading = false;
    message = '';
    messageType = 'success';

    constructor(private apiService: ApiService) { }

    ngOnInit(): void {
        this.loadEmployers();
    }

    loadEmployers(): void {
        this.loading = true;
        this.apiService.getAllEmployers().subscribe({
            next: (data) => {
                this.employers = data;
                this.loading = false;
            },
            error: () => this.loading = false
        });
    }

    approve(userId: number): void {
        this.apiService.approveEmployer(userId).subscribe({
            next: () => {
                this.showMessage('Employer approved', 'success');
                this.loadEmployers();
            },
            error: () => this.showMessage('Error approving employer', 'error')
        });
    }

    deny(userId: number): void {
        this.apiService.denyEmployer(userId).subscribe({
            next: () => {
                this.showMessage('Employer denied', 'success');
                this.loadEmployers();
            },
            error: () => this.showMessage('Error denying employer', 'error')
        });
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'APPROVED': return 'badge-success';
            case 'PENDING': return 'badge-warning';
            case 'DENIED': return 'badge-danger';
            default: return 'badge-info';
        }
    }

    private showMessage(msg: string, type: string): void {
        this.message = msg;
        this.messageType = type;
        setTimeout(() => this.message = '', 3000);
    }
}
