import { Component, Inject, NgZone, OnInit, PLATFORM_ID } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { ProjectManagerComponent } from '../project-manager/project-manager.component';
import { CalendarComponent } from '../calendar/calendar.component';
import { AuthService } from '../commons/auth/auth.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-page',
  imports: [
    HeaderComponent,
    ProjectManagerComponent,
    CalendarComponent,
    CommonModule
  ],
  providers:[
    AuthService
  ],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss'
})
export class UserPageComponent implements OnInit{
  
  isBrowser: boolean;
  private platformId: Object;
  private mainContentElement: HTMLElement | null = null;
  private observer: MutationObserver | null = null;

  constructor(
    public authService: AuthService,
    @Inject(PLATFORM_ID) platformId: Object,
    private ngZone: NgZone,
    private router : Router
  ){
      this.platformId = platformId;
      this.isBrowser = isPlatformBrowser(platformId);

  }

  ngOnInit(){
    this.checkToken();
    if(isPlatformBrowser(this.platformId)){
      console.log(localStorage.getItem('authToken'))
    }

  }

  checkToken() {
    // Verifica si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      
      // Si hay un token y está expirado, lo eliminamos
      if (token && this.isTokenExpired(token)) {
        localStorage.removeItem('authToken');
        console.log('Token expirado eliminado.');
        // Opcional: Redirigir a login
        // this.router.navigate(['/login']);
      }
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return now >= payload.exp;
    } catch (error) {
      console.error('Error decodificando el token:', error);
      return true; // Si hay error, consideramos el token como inválido
    }
  }
  
  redirectToLogin(){
    
  }
}
