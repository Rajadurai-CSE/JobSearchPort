import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { ApiService } from '../../../core/services/api.service';
import { DisplayEmployerProfile } from '../../../core/models/user.model';

@Component({
  selector: 'app-employers',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './employers.component.html',
  styleUrls: [ './employers.component.css']
})
export class EmployersComponent implements OnInit {
  private apiService = inject(ApiService);

  employers: DisplayEmployerProfile[] = [];
  loading = true;
  message = '';
  messageType = 'success';

  ngOnInit(): void {
    this.loadEmployers();
  }

  loadEmployers(): void {
    this.apiService.getAllEmployers().subscribe({
      next: (data) => {
        this.employers = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  approveEmployer(emp: DisplayEmployerProfile): void {
    this.apiService.approveEmployer(emp.userId).subscribe({
      next: () => {
        emp.status = 'APPROVED';
        this.showMessage('Employer approved', 'success');
      },
      error: () => this.showMessage('Failed to approve', 'error')
    });
  }

  denyEmployer(emp: DisplayEmployerProfile): void {
    if (!confirm(`Deny ${emp.email}?`)) return;

    this.apiService.denyEmployer(emp.userId).subscribe({
      next: () => {
        emp.status = 'DENIED';
        this.showMessage('Employer denied', 'success');
      },
      error: () => this.showMessage('Failed to deny', 'error')
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'APPROVED': return 'badge-success';
      case 'PENDING': return 'badge-warning';
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
