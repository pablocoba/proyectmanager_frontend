import { Routes } from '@angular/router';
import { authGuard } from './commons/auth/auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./login/login.component').then(m => m.LoginComponent),
        title: 'Login'
    },
    {
        path: 'user',
        loadComponent: () => import('./user-page/user-page.component').then(m => m.UserPageComponent),
        canActivate: [authGuard],
        title: 'User Dashboard'
    },
    {
        path: '',
        redirectTo: 'user',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'user'
    }
];