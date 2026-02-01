import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Guard: Check if user is logged in
export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isLoggedIn()) {
        // Check status for revoked users (any role)
        const status = authService.getUserStatus();
        if (status === 'REVOKED') {
            router.navigate(['/revoked']);
            return false;
        }
        if (status === 'DENIED') {
            router.navigate(['/denied']);
            return false;
        }
        return true;
    }

    router.navigate(['/login']);
    return false;
};

// Guard: Check if user has required role
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

    // Redirect to login if role doesn't match
    router.navigate(['/login']);
    return false;
};

// Guard: Check employer approval status
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

    // Job seekers are auto-approved
    if (role === 'JOB_SEEKER') {
        if (status === 'REVOKED') {
            router.navigate(['/revoked']);
            return false;
        }
        return status === 'APPROVED';
    }

    // Employers need status check
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

// Guard: Allow PENDING employers to access setup route
export const setupGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isLoggedIn()) {
        router.navigate(['/login']);
        return false;
    }

    const role = authService.getUserRole();
    const status = authService.getUserStatus();

    // Allow PENDING and DENIED employers to access setup
    if (role === 'EMPLOYER' && (status === 'PENDING' || status === 'DENIED')) {
        return true;
    }

    // If already approved, redirect to dashboard
    if (role === 'EMPLOYER' && status === 'APPROVED') {
        router.navigate(['/employer/dashboard']);
        return false;
    }

    // Fallback to login for others
    router.navigate(['/login']);
    return false;
};
