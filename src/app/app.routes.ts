import { Routes } from '@angular/router';

export const routes: Routes = [
    {
    path: '',
    redirectTo: 'user-page',
    pathMatch: 'full'
    },
    {
    path: 'user-page',
    loadComponent: () => import('./user-page/user-page.component').then(m => m.UserPageComponent)
    }
];
