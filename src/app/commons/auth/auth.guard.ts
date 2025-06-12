import { inject, PLATFORM_ID } from '@angular/core'; // <--- Importa PLATFORM_ID
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { isPlatformBrowser } from '@angular/common'; // <--- Importa isPlatformBrowser

export const authGuard: CanActivateFn = (route, state) => { // <--- Añade route y state como parámetros
    const authService = inject(AuthService);
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID); // <--- Inyecta PLATFORM_ID

    if (isPlatformBrowser(platformId)) { // <--- Protege el acceso a localStorage y redirecciones del navegador
        if (authService.isAuthenticated()) {
            return true; // Si está autenticado, permite el acceso
        } else {
            // Si no está autenticado, redirige a login
            console.warn('🔐 Usuario no autenticado - Redirigiendo a login (cliente)');
            return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
        }
    }


    console.warn('🔐 Usuario no autenticado - Bloqueando ruta en el servidor');
    return false;
};