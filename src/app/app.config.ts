import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import Noir from '../noirpreset';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // <-- Importa 'withInterceptors'
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
// import { AuthInterceptor } from './auth.interceptor'; // <-- ¡Ya NO importamos la clase directamente aquí!

// Importa tu función interceptora (crearemos una si no la tienes)
import { authInterceptor } from './commons/auth/auth.interceptor'; // <-- Importa la función interceptora
import { provideClientHydration } from '@angular/platform-browser';
import { AuthService } from './commons/auth/auth.service';

export const appConfig: ApplicationConfig = {
    providers: [
        // Aquí es donde cambia la configuración de HttpClient
        // provideHttpClient(withInterceptors([authInterceptor])), // <-- Esta es la forma moderna
        // Si tienes interceptores DI-based (clases como AuthInterceptor), usa withInterceptorsFromDi
        provideHttpClient(
            withInterceptors([authInterceptor])
        ), 
        provideRouter(routes),
        AuthService,
        provideClientHydration(),
        provideAnimationsAsync(),
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
};