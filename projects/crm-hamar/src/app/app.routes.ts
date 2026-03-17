import { Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/layout/main-layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./features/auth/pages/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        loadComponent: () => import('./features/dashboard/pages/home/home.component').then(m => m.HomeComponent),
        data: { breadcrumb: 'Dashboard' }
      },
      {
        path: 'clientes',
        loadChildren: () => import('./features/clientes/clientes.routes').then(m => m.clientesRoutes),
        data: { breadcrumb: 'Clientes' }
      },
      {
        path: 'whatsapp',
        loadComponent: () => import('./features/comunicaciones/pages/sms/sms.component').then(m => m.SmsComponent),
        data: { breadcrumb: 'WhatsApp' }
      },
      {
        path: 'documentos',
        loadComponent: () => import('./features/documentos/pages/documentos-list/documentos-list.component').then(m => m.DocumentosListComponent),
        data: { breadcrumb: 'Documentos' }
      },
      {
        path: 'seguimiento',
        loadComponent: () => import('./features/seguimiento/pages/seguimiento-list/seguimiento-list.component').then(m => m.SeguimientoListComponent),
        data: { breadcrumb: 'Seguimiento' }
      },
      {
        path: 'tablero',
        loadComponent: () => import('./features/seguimiento/pages/tablero/tablero.component').then(m => m.TableroComponent),
        data: { breadcrumb: 'Tablero' }
      },
      {
        path: 'configuracion/usuarios',
        loadComponent: () => import('./features/configuracion/pages/usuarios-config/usuarios-config.component').then(m => m.UsuariosConfigComponent),
        data: { breadcrumb: 'Usuarios' }
      },

      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
