// auth.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router'; 
@Injectable({ providedIn: 'root' })
export class AuthService {
    private isBrowser: boolean;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private router: Router
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    isAuthenticated(): boolean {
        if (!this.isBrowser){
            return false;
        } 
        const token = localStorage.getItem('authToken');
        if(token === null || this.isTokenExpired(token)){
            this.router.navigate(['/login']);
        }
        return !!token && !this.isTokenExpired(token); // Implementa validación de expiración
    }
    logout(): void {
        if (isPlatformBrowser(this.platformId)) {
        // 1. Eliminar el token y cualquier otra información de sesión del localStorage
        localStorage.removeItem('authToken');
        console.log('Sesión cerrada. Token eliminado.');

        // 2. Redirigir al usuario a la página de login
        this.router.navigate(['/login'], { replaceUrl: true }).then(() => {
            // window.location.reload();
        }).catch(error => {
            console.error('Error durante la redirección al login:', error);
        });
    }
    }

    login(token: string): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('authToken', token);
        }
    }
    private isTokenExpired(token: string): boolean {
        // Implementa lógica de validación de token
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return Date.now() >= payload.exp * 1000;
        } catch {
            return true;
        }
    }
}