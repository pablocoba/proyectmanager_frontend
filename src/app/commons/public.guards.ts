// src/app/commons/guards/public.guard.ts (Nuevo archivo)
import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { isPlatformBrowser } from '@angular/common'; // Para SSR

export const publicGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID) as Object;

  if (isPlatformBrowser(platformId)) { // Solo chequea en el navegador
    if (authService.isAuthenticated()) {
      // Si el usuario está autenticado, redirige a la página de usuario
      return router.createUrlTree(['/user']); // O '/dashboard', la ruta principal de tu usuario
    }
  }
  // Si no está autenticado (o en el servidor), permite el acceso a la ruta pública
  return true;
};