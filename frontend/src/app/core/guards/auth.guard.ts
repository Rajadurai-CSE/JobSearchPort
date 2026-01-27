import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isLoggedIn()) {
        return true;
    }

    router.navigate(['/login']);
    return false;
};

export const roleGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isLoggedIn()) {
        router.navigate(['/login']);
        return false;
    }

    const requiredRoles = route.data['roles'] as string[];
    const userRole = authService.getUserRole();

    if (requiredRoles && userRole && requiredRoles.includes(userRole)) {
        return true;
    }

    // Redirect to appropriate dashboard
    router.navigate(['/']);
    return false;
};

export const statusGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isLoggedIn()) {
        router.navigate(['/login']);
        return false;
    }

    const status = authService.getUserStatus();
    const role = authService.getUserRole();

    // Admin always has access
    if (role === 'ADMIN') {
        return true;
    }

    // Job seekers are always approved
    if (role === 'JOB_SEEKER' && status === 'APPROVED') {
        return true;
    }

    // Employers need approval
    if (role === 'EMPLOYER') {
        if (status === 'PENDING') {
            router.navigate(['/employer/pending']);
            return false;
        }
        if (status === 'REVOKED') {
            router.navigate(['/revoked']);
            return false;
        }
        if (status === 'DENIED') {
            router.navigate(['/denied']);
            return false;
        }
        if (status === 'APPROVED') {
            return true;
        }
    }

    return false;
};
