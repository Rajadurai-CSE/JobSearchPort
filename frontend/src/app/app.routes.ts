import { Routes } from '@angular/router';
import { authGuard, roleGuard, statusGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    // Public routes
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    {
        path: 'login',
        loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent)
    },

    // Job Seeker routes
    {
        path: 'jobseeker',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['JOB_SEEKER'] },
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            {
                path: 'dashboard',
                loadComponent: () => import('./pages/jobseeker/dashboard/dashboard.component').then(m => m.DashboardComponent)
            },
            {
                path: 'jobs',
                loadComponent: () => import('./pages/jobseeker/job-list/job-list.component').then(m => m.JobListComponent)
            },
            {
                path: 'jobs/:id',
                loadComponent: () => import('./pages/jobseeker/job-detail/job-detail.component').then(m => m.JobDetailComponent)
            },
            {
                path: 'applications',
                loadComponent: () => import('./pages/jobseeker/applications/applications.component').then(m => m.ApplicationsComponent)
            },
            {
                path: 'bookmarks',
                loadComponent: () => import('./pages/jobseeker/bookmarks/bookmarks.component').then(m => m.BookmarksComponent)
            },
            {
                path: 'profile',
                loadComponent: () => import('./pages/jobseeker/profile/profile.component').then(m => m.ProfileComponent)
            }
        ]
    },

    // Employer routes
    {
        path: 'employer',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['EMPLOYER'] },
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            {
                path: 'pending',
                loadComponent: () => import('./pages/employer/pending/pending.component').then(m => m.PendingComponent)
            },
            {
                path: 'dashboard',
                canActivate: [statusGuard],
                loadComponent: () => import('./pages/employer/dashboard/dashboard.component').then(m => m.EmployerDashboardComponent)
            },
            {
                path: 'profile',
                canActivate: [statusGuard],
                loadComponent: () => import('./pages/employer/profile/profile.component').then(m => m.EmployerProfileComponent)
            },
            {
                path: 'jobs',
                canActivate: [statusGuard],
                loadComponent: () => import('./pages/employer/job-management/job-management.component').then(m => m.JobManagementComponent)
            },
            {
                path: 'jobs/create',
                canActivate: [statusGuard],
                loadComponent: () => import('./pages/employer/job-form/job-form.component').then(m => m.JobFormComponent)
            },
            {
                path: 'jobs/:id/edit',
                canActivate: [statusGuard],
                loadComponent: () => import('./pages/employer/job-form/job-form.component').then(m => m.JobFormComponent)
            },
            {
                path: 'applicants/:jobId',
                canActivate: [statusGuard],
                loadComponent: () => import('./pages/employer/applicants/applicants.component').then(m => m.ApplicantsComponent)
            }
        ]
    },

    // Admin routes
    {
        path: 'admin',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN'] },
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            {
                path: 'dashboard',
                loadComponent: () => import('./pages/admin/dashboard/dashboard.component').then(m => m.AdminDashboardComponent)
            },
            {
                path: 'users',
                loadComponent: () => import('./pages/admin/users/users.component').then(m => m.UsersComponent)
            },
            {
                path: 'employers',
                loadComponent: () => import('./pages/admin/employers/employers.component').then(m => m.EmployersComponent)
            },
            {
                path: 'flagged-jobseekers',
                loadComponent: () => import('./pages/admin/flagged-jobseekers/flagged-jobseekers.component').then(m => m.FlaggedJobSeekersComponent)
            },
            {
                path: 'flagged-jobs',
                loadComponent: () => import('./pages/admin/flagged-jobs/flagged-jobs.component').then(m => m.FlaggedJobsComponent)
            }
        ]
    },

    // Status pages
    {
        path: 'revoked',
        loadComponent: () => import('./pages/status/revoked/revoked.component').then(m => m.RevokedComponent)
    },
    {
        path: 'denied',
        loadComponent: () => import('./pages/status/denied/denied.component').then(m => m.DeniedComponent)
    },

    // Fallback
    { path: '**', redirectTo: '/login' }
];
