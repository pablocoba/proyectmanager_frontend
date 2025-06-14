import { ChangeDetectorRef, Component, Inject, NgZone, OnInit, PLATFORM_ID } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { ProjectManagerComponent } from '../project-manager/project-manager.component';
import { CalendarComponent } from '../calendar/calendar.component';
import { AuthService } from '../commons/auth/auth.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { CurrentProyectoService } from '../commons/services/CurrentProyectoService';
import { MiembroProyectoDto } from '../commons/dto/MiembroProyectoDto';
import { ProyectoService } from '../commons/services/ProyectoService';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AlertService } from '../commons/services/AlertService';
import { CreateProyectoComponent } from '../create-proyecto/create-proyecto.component';
import { Subscription, take } from 'rxjs';
import { MiembroDto } from '../commons/dto/MiembroDto';
import { MiembroService } from '../commons/services/MiembroService';
import { CreateProyectoDto } from '../commons/dto/CreateProyectoDto';
import { ProyectoDto } from '../commons/dto/ProyectoDto';
import { ButtonModule } from 'primeng/button';
import { TareaService } from '../commons/services/TareaService';

@Component({
  selector: 'app-user-page',
  imports: [
    HeaderComponent,
    ProjectManagerComponent,
    CalendarComponent,
    CommonModule,
    ButtonModule
  ],
  providers:[
    AuthService,
    DialogService,
    AlertService,
    MessageService
  ],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss'
})

export class UserPageComponent implements OnInit{
  
  isBrowser: boolean;
  private platformId: Object;
  private mainContentElement: HTMLElement | null = null;
  private observer: MutationObserver | null = null;
  proyectoActual: number | null = null;
  proyectosUsuario : MiembroProyectoDto[] = []
  ref: DynamicDialogRef | undefined;
  private dialogSubscription: Subscription | undefined; // Para gestionar la suscripción
  currentMember !: MiembroDto;
  tareasAmpliado : boolean = false;

  nuevoProyecto : CreateProyectoDto = {
    nombre: "prueba",
    descripcion: "prueba",
    fechaInicio: new Date(),
    fechaFin: new Date(),
    miembrosProyecto: [] 
  };
  
  currentProject !: ProyectoDto;
  
  constructor(
    public authService: AuthService,
    @Inject(PLATFORM_ID) platformId: Object,
    private currentProyecto : CurrentProyectoService,
    private proyectoService : ProyectoService,
    private dialogService : DialogService,
    private miembroService : MiembroService,
    private cdr : ChangeDetectorRef,
    private tareaService : TareaService
  ){
      this.platformId = platformId;
      this.isBrowser = isPlatformBrowser(platformId);
      this.proyectoService.getProyectosUsuario().subscribe(proyectos=>{
        this.proyectosUsuario = proyectos;
        console.log("fnjskdfnjksdfbjksdfjklñsfsdñkf",this.proyectosUsuario)
      })
  }

  ngOnInit(){
    this.checkToken();
    if(isPlatformBrowser(this.platformId)){
      console.log(localStorage.getItem('authToken'))
    }
    this.loadCurrentMember()
    
    this.currentProyecto.proyectoActual$.subscribe(id=>{
      this.proyectoActual = id;
      console.log('proyecto actual cambiado:', id)
    })

    this.tareaService.tareasUpdated$.subscribe(() => {
      this.cdr.detectChanges();
    });

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

  createProyecto(){
  
      const isMobile = window.innerWidth < 768;
  
      this.ref = this.dialogService.open(CreateProyectoComponent, {
        header: "Nuevo Proyecto",
        width: isMobile ? '82%' : '30%', //hace que sea más grande o peque en móvil o desktop
        height: 'auto',
        modal: true,
        closable: true,
        contentStyle: {
          'max-height': '80vh',
          overflow: 'auto',
          'padding': '0'
        },
        baseZIndex: 10000
      });
  
      this.dialogSubscription = this.ref.onClose.subscribe(proyectoData=>{
  
        console.log(proyectoData.fechaFin)
  
        let nuevo = [
          {miembro : { idMiembro: this.currentMember.idMiembro}}
        ]
        this.nuevoProyecto ={
          nombre:proyectoData.nombre,
          descripcion:proyectoData.descripcion,
          fechaInicio:new Date(),
          fechaFin: proyectoData.fechaFin,
          miembrosProyecto: nuevo
        }
  
        console.log("nuevonuevo",this.nuevoProyecto)
  
        this.proyectoService.createProyecto(this.nuevoProyecto).subscribe({
          next: (proyectoCreado) => {
            console.log("Proyecto creado:", proyectoCreado);
            
            // Verificar si era el primer proyecto del usuario
            if (this.proyectosUsuario.length === 0) {
              // Actualizar la lista de proyectos del usuario
              this.proyectoService.getProyectosUsuario().subscribe(proyectos => {
                this.proyectosUsuario = proyectos;
                // Establecer el nuevo proyecto como actual
                if (proyectos.length === 1) {
                  this.currentProyecto.cambiarProyecto(proyectos[0].idProyecto).subscribe(() => {
                    // 3. Forzar recarga del header
                    window.dispatchEvent(new Event('proyecto-actualizado'));
                  });
                }
              });
            }
          },
          error: (err) => {
            console.error("Error al crear proyecto:", err);
          }
        });
      })
    }
    actualizarProyectos() {
      this.proyectoService.getProyectosUsuario().pipe(
        take(1) // Para evitar fugas de memoria
      ).subscribe(proyectos => {
        this.proyectosUsuario = proyectos;
        this.cdr.detectChanges();
      });
    }

    loadCurrentMember() {
    if (isPlatformBrowser(this.platformId)) {
      const username = localStorage.getItem('username');
      if (username) {
        this.miembroService.getMiembroActual().subscribe({
          next: (miembro) => {
            if (miembro) {  // Verificamos que no sea null
              this.currentMember = miembro;
              console.log('Miembro actual cargado:', this.currentMember);
            } else {
              console.warn('No se encontró el miembro actual');
              // Aquí puedes manejar el caso null como necesites
            }
          },
          error: (err) => {
            console.error('Error al cargar miembro:', err);
          }
        });
      }
    }
  }

  ampliarTareas(){
    if(this.tareasAmpliado){
      this.tareasAmpliado = false;
    }
    else{
      this.tareasAmpliado = true;
    }
  }
}
