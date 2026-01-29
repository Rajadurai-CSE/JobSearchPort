import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './navbar.component.html',
    styleUrls: [ './navbar.component.css']
})
export class NavbarComponent {
    authService = inject(AuthService);
    private router = inject(Router);

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
