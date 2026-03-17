import { Routes } from '@angular/router';

export const configuracionRoutes: Routes = [
  {
    path: '',
    redirectTo: 'cloudtalk',
    pathMatch: 'full'
  },
  {
    path: 'cloudtalk',
    loadComponent: () => import('./pages/cloudtalk-settings/cloudtalk-settings.component').then(m => m.CloudtalkSettingsComponent)
  }
];
