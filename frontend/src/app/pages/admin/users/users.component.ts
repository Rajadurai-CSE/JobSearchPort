import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { ApiService } from '../../../core/services/api.service';
import { UserDto } from '../../../core/models/user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  private apiService = inject(ApiService);

  users: UserDto[] = [];
  loading = true;
  message = '';
  messageType = 'success';

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.apiService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  revokeUser(user: UserDto): void {
    if (!confirm(`Revoke access for ${user.email}?`)) return;

    this.apiService.revokeUser(user.userId).subscribe({
      next: () => {
        user.status = 'REVOKED';
        this.showMessage('User revoked', 'success');
      },
      error: () => this.showMessage('Failed to revoke', 'error')
    });
  }

  reinstateUser(user: UserDto): void {
    if (!confirm(`Reinstate access for ${user.email}?`)) return;

    this.apiService.reinstateUser(user.userId).subscribe({
      next: () => {
        user.status = 'APPROVED';
        this.showMessage('User reinstated', 'success');
      },
      error: () => this.showMessage('Failed to reinstate', 'error')
    });
  }

  deleteUser(user: UserDto): void {
    if (!confirm(`Permanently delete ${user.email}?`)) return;

    this.apiService.deleteUser(user.userId).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.userId !== user.userId);
        this.showMessage('User deleted', 'success');
      },
      error: () => this.showMessage('Failed to delete', 'error')
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'APPROVED': return 'badge-success';
      case 'PENDING': return 'badge-warning';
      case 'REVOKED': return 'badge-danger';
      case 'DENIED': return 'badge-danger';
      default: return 'badge-secondary';
    }
  }

  private showMessage(msg: string, type: string): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => this.message = '', 3000);
  }
}
