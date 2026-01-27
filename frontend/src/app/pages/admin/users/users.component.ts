import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ApiService } from '../../../core/services/api.service';
import { UserDto } from '../../../core/models/admin.model';

@Component({
    selector: 'app-users',
    standalone: true,
    imports: [CommonModule, NavbarComponent],
    template: `
    <app-navbar></app-navbar>
    <div class="page-container">
      <div class="page-header">
        <h1>User Management</h1>
        <p>View and manage all platform users</p>
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
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users">
              <td>{{ user.userId }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.name || '-' }}</td>
              <td><span class="badge badge-info">{{ user.role }}</span></td>
              <td><span class="badge" [ngClass]="getStatusClass(user.status)">{{ user.status }}</span></td>
              <td>
                <button 
                  *ngIf="user.status !== 'REVOKED' && user.role !== 'ADMIN'" 
                  class="btn btn-danger btn-sm" 
                  (click)="revokeUser(user.userId)">
                  Revoke
                </button>
                <button 
                  *ngIf="user.status === 'REVOKED'" 
                  class="btn btn-danger btn-sm" 
                  (click)="deleteUser(user.userId)">
                  Delete
                </button>
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
export class UsersComponent implements OnInit {
    users: UserDto[] = [];
    loading = false;
    message = '';
    messageType = 'success';

    constructor(private apiService: ApiService) { }

    ngOnInit(): void {
        this.loadUsers();
    }

    loadUsers(): void {
        this.loading = true;
        this.apiService.getAllUsers().subscribe({
            next: (data) => {
                this.users = data;
                this.loading = false;
            },
            error: () => this.loading = false
        });
    }

    revokeUser(userId: number): void {
        if (!confirm('Revoke this user\'s access?')) return;

        this.apiService.revokeUser(userId).subscribe({
            next: () => {
                this.showMessage('User access revoked', 'success');
                this.loadUsers();
            },
            error: () => this.showMessage('Error revoking user', 'error')
        });
    }

    deleteUser(userId: number): void {
        if (!confirm('Permanently delete this user?')) return;

        this.apiService.deleteUser(userId).subscribe({
            next: () => {
                this.showMessage('User deleted', 'success');
                this.loadUsers();
            },
            error: () => this.showMessage('Error deleting user', 'error')
        });
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'APPROVED': return 'badge-success';
            case 'PENDING': return 'badge-warning';
            case 'REVOKED': case 'DENIED': return 'badge-danger';
            default: return 'badge-info';
        }
    }

    private showMessage(msg: string, type: string): void {
        this.message = msg;
        this.messageType = type;
        setTimeout(() => this.message = '', 3000);
    }
}
