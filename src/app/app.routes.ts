import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./layouts/dashboard-layout/dashboard-layout.component').then((m) => m.DashboardLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./pages/users/users.component').then((m) => m.UsersComponent)
      },
      {
        path: 'applications',
        loadComponent: () =>
          import('./pages/applications/applications.component').then((m) => m.ApplicationsComponent)
      },
      {
        path: 'roles',
        loadComponent: () =>
          import('./pages/roles/roles.component').then((m) => m.RolesComponent)
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./pages/notifications/notifications.component').then((m) => m.NotificationsComponent)
      },
      {
        path: 'institution',
        loadComponent: () =>
          import('./pages/institution/institution.component').then((m) => m.InstitutionComponent)
      },
      {
        path: 'profile-settings',
        loadComponent: () =>
          import('./pages/profile/profile.component').then((m) => m.ProfileComponent)
      },
      {
        path: 'audit',
        loadComponent: () =>
          import('./pages/audit/audit.component').then((m) => m.AuditComponent)
      },
      {
        path: ':feature',
        loadComponent: () =>
          import('./pages/blank/blank-page.component').then((m) => m.BlankPageComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
