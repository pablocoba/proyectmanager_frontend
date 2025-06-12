import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // <-- Añade withInterceptors
import { ConfirmationService, MessageService } from 'primeng/api';
import { MiembroService } from './app/commons/services/MiembroService';
import { ProyectoService } from './app/commons/services/ProyectoService';
import { NgModule, LOCALE_ID, importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from './app/commons/services/AlertService';
import { provideAnimations } from '@angular/platform-browser/animations';
import { authInterceptor } from './app/commons/auth/auth.interceptor'; // <-- Importa tu interceptor
import { routes } from './app/app.routes';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Noir from './noirpreset';

bootstrapApplication(AppComponent, {
  providers: [
    // Configura HttpClient con interceptores
    provideHttpClient(withInterceptors([authInterceptor])), // <-- Así se añaden interceptores funcionales
    provideRouter(routes),
    // Resto de tus providers
    MiembroService,
    ProyectoService,
    ConfirmationService,
    MessageService,
    importProvidersFrom(CommonModule),
    AlertService,
    provideAnimations(),
    providePrimeNG({
            ripple:true,
            theme: {
                preset: Noir
            },
            zIndex:{
                modal: 1100,
                overlay: 1000,
                menu: 1000,
                tooltip: 900
            }
            
        }),
  ]
})
.catch((err) => console.error(err));