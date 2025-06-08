import { Routes } from '@angular/router';
import { UserPageComponent } from './user-page.component';

export const routes: Routes = [
  {
    path: '',
    component: UserPageComponent,
    children: [
      {
        path: 'calendar',
        loadComponent: () => import('../calendar/calendar.component').then(m => m.CalendarComponent)
      },
    //   {
    //     path: 'prescriptores',
    //     loadComponent: () => import('../prescriptores/prescriptores.component').then(m => m.PrescriptoresComponent)
    //   },
    //   {
    //     path: 'talonarios',
    //     loadComponent: () => import('../talonarios/talonarios.component').then(m => m.TalonariosComponent)
    //   }
    ]
  }
];
