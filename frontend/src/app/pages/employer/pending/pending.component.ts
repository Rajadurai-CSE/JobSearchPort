import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
    selector: 'app-pending',
    standalone: true,
    imports: [CommonModule, RouterLink, NavbarComponent],
    template: `
    <app-navbar></app-navbar>
    <div class="page-container">
      <div class="card text-center" style="max-width: 600px; margin: 4rem auto;">
        <div style="font-size: 4rem; margin-bottom: 1rem;">⏳</div>
        <h2>Account Pending Approval</h2>
        <p class="text-muted">
          Your employer account is being reviewed by our admin team. 
          You'll be able to access the dashboard once your account is approved.
        </p>
        <p class="text-muted">
          This usually takes 1-2 business days. We'll notify you via email once approved.
        </p>
        
        <div class="alert alert-info mt-3">
          <strong>Tip:</strong> Make sure to complete your profile and company information to speed up the approval process.
        </div>
      </div>
    </div>
  `
})
export class PendingComponent { }
