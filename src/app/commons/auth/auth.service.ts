import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private isBrowser: boolean;
    private authStatus = new BehaviorSubject<boolean>(false);

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private router: Router
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);
        this.checkInitialAuthStatus();
    }

    private checkInitialAuthStatus(): void {
        if (this.isBrowser) {
            this.authStatus.next(this.isAuthenticated());
        }
    }

    isAuthenticated(): boolean {
        if (!this.isBrowser) return false;
        
        const token = localStorage.getItem('authToken');
        return !!token && !this.isTokenExpired(token);
    }

    logout(): void {
        if (!this.isBrowser) return;

        try {
            // 1. Limpiar todos los datos de autenticación
            localStorage.removeItem('authToken');
            sessionStorage.clear(); // Limpieza adicional
            
            // 2. Actualizar el estado de autenticación
            this.authStatus.next(false);
            
            // 3. Redirección con manejo de errores mejorado
            this.router.navigate(['/login'], { 
                replaceUrl: true,
                queryParams: { session: 'closed' } 
            }).then(success => {
                if (!success) {
                    console.warn('Redirección fallida, usando fallback');
                    window.location.href = '/login';
                }
            });
            
            console.log('Logout exitoso');
        } catch (error) {
            console.error('Error en logout:', error);
            // Fallback absoluto
            window.location.href = '/login';
        }
    }

    login(token: string): void {
        if (!this.isBrowser) return;
        
        try {
            localStorage.setItem('authToken', token);
            this.authStatus.next(true);
            this.router.navigate(['/']);
        } catch (error) {
            console.error('Error al guardar el token:', error);
        }
    }

    private isTokenExpired(token: string): boolean {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return Date.now() >= payload.exp * 1000;
        } catch {
            return true;
        }
    }

    getAuthStatus() {
        return this.authStatus.asObservable();
    }
}