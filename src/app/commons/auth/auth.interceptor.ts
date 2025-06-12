// auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core'; // Importa PLATFORM_ID
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common'; // Importa isPlatformBrowser

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Servicios necesarios
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID); // ¡Inyecta PLATFORM_ID dentro de la función!

  let authToken: string | null = null;

  // Protege el acceso a localStorage con isPlatformBrowser
  if (isPlatformBrowser(platformId)) {
    authToken = localStorage.getItem('authToken');
    console.log('🔄 Interceptor ejecutado (cliente) - Token:', authToken ? authToken : 'No hay token');
  } else {
    // Si estamos en el servidor, no hay token de localStorage para adjuntar.
    // console.log('🔄 Interceptor ejecutado (servidor) - No hay localStorage');
  }

  // Clonar request si hay token (solo si se obtuvo del cliente)
  const authReq = authToken
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`,
          'X-Requested-With': 'XMLHttpRequest' // Si es necesario, PrimeNG a veces lo necesita
        }
      })
    : req;

  // Procesar la solicitud
  return next(authReq).pipe(
    catchError((error) => {
      // Manejar error 401 (No autorizado)
      // Esta parte también debe ser protegida si hay acceso a localStorage/window
      if (error.status === 401) {
        if (isPlatformBrowser(platformId)) { // Protege también aquí
          console.warn('🔐 Sesión expirada - Redirigiendo a login (cliente)');
          localStorage.removeItem('authToken'); // Protegido
          router.navigate(['/login'], {
            queryParams: { returnUrl: router.url },
            replaceUrl: true
          });
        } else {
          // En el servidor, un 401 puede manejarse de otra forma (ej. registrar en logs del servidor)
          console.warn('🔐 Sesión expirada (servidor) - Error 401 detectado.');
        }
      }
      return throwError(() => error);
    })
  );
};