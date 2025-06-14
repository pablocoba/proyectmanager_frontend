import { Component, OnInit, Output, EventEmitter, Inject, PLATFORM_ID, Input, ChangeDetectorRef } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { catchError, distinctUntilChanged, of, Subscription, switchMap, take } from 'rxjs';
import { AlertService } from '../commons/services/AlertService';
import { CreateTareaDialogComponent } from './create-tarea-dialog/create-tarea-dialog.component';
import { UserToken } from '../commons/dto/UserToken';
import { AuthService } from '../commons/auth/auth.service';
import { Drawer, DrawerModule } from 'primeng/drawer';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { RippleModule } from 'primeng/ripple';
import { CommonModule, isPlatformBrowser, SlicePipe } from '@angular/common';
import { Proyecto } from '../commons/dto/Proyecto';
import { ProyectoService } from '../commons/services/ProyectoService';
import { ProyectoDto } from '../commons/dto/ProyectoDto';
import { ChatComponent } from '../chat/chat.component';
import { StyleClassModule } from 'primeng/styleclass';
import { MiembroDto } from '../commons/dto/MiembroDto';
import { MiembroService } from '../commons/services/MiembroService';
import { CurrentProyectoService } from '../commons/services/CurrentProyectoService';
import { MiembroProyectoDto } from '../commons/dto/MiembroProyectoDto';
import { CreateProyectoDto } from '../commons/dto/CreateProyectoDto';
import { CreateProyectoComponent } from './create-proyecto/create-proyecto.component';

@Component({
  selector: 'app-header',
  imports: [
    ButtonModule,
    MenuModule,
    DrawerModule,
    AvatarModule,
    AvatarGroupModule,
    RippleModule,
    ChatComponent,
    StyleClassModule,
    CommonModule,
    SlicePipe
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  providers: [
    DialogService,
    AlertService,
    MessageService
  ],
})

export class HeaderComponent implements OnInit {

  visible: boolean = true;
  chatVisibility:boolean = true;
  projectsMenuOpen: boolean = true;
  @Output() sidebarStateChange = new EventEmitter<boolean>();
  @Output() proyectoCreado = new EventEmitter<void>();

  user !: UserToken;
  mostrarNuevaTarea: boolean = false;
  items: MenuItem[] = [
    // {
    //   label: 'Nueva Tarea',
    //   icon: 'pi pi-plus',
    //   command: () => this.showCreateTareaDialog()  // Función al hacer clic
    // },
    {
      label: 'Nuevo Proyecto',
      icon: 'pi pi-plus',
      command: () => this.crearProyecto()
    }
  ];

  @Input() proyectoActual: number | null = null;
  @Input() proyectosUsuario: MiembroProyectoDto[] | null = null;
  ref: DynamicDialogRef | undefined;
  private dialogSubscription: Subscription | undefined; // Para gestionar la suscripción

  currentProject !: ProyectoDto | null;
  proyectos : ProyectoDto[] = [];
  username !: string;
  currentMember !: MiembroDto;
  
  nuevoProyecto : CreateProyectoDto = {
    nombre: "prueba",
    descripcion: "prueba",
    fechaInicio: new Date(),
    fechaFin: new Date(),
    miembrosProyecto: [] 
  };
  
  constructor(
    private dialogService: DialogService,
    private authService: AuthService,
    private proyectoService : ProyectoService,
    private miembroService : MiembroService,
    public currentProyecto : CurrentProyectoService,
    private cdr : ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId:Object
  ) {

    if(isPlatformBrowser(this.platformId)){
      this.user = {
        username : localStorage.getItem('username')!,
        token: localStorage.getItem('authToken')!
      }
    }

    this.proyectoService.getProyectosUsuario().subscribe(proyectos=>{
      this.proyectosUsuario = proyectos;
      console.log("fnjskdfnjksdfbjksdfjklñsfsdñkf",this.proyectosUsuario)
    })
    
    this.currentProyecto.proyectoActual$.pipe(
      distinctUntilChanged(),
      switchMap(idProyecto => {
        if (idProyecto !== null) {
          return this.proyectoService.getProyectosById(idProyecto).pipe(
            catchError(() => of(null))
          );
        }
        return of(null);
      })
    ).subscribe(proyecto => {
      this.currentProject = proyecto;
      this.actualizarMenuItems();
      this.cdr.markForCheck();
    });


  }

  ngOnInit() {
    this.loadCurrentMember()
  }

  actualizarMenuItems() {
    setTimeout(() => { // Ejecuta en el siguiente ciclo de detección de cambios
      const tieneProyecto = !!this.currentProject;
      
      this.items = [
        ...(tieneProyecto ? [{
          label: 'Nueva Tarea',
          icon: 'pi pi-plus',
          command: () => this.showCreateTareaDialog()
        }] : []),
        {
          label: 'Nuevo Proyecto',
          icon: 'pi pi-plus',
          command: () => this.crearProyecto()
        }
      ];
      
      this.cdr.markForCheck(); // Marca para verificación
    });
  }

  showCreateTareaDialog() {

    const isMobile = window.innerWidth < 768;

    this.ref = this.dialogService.open(CreateTareaDialogComponent, {
      header: "Nueva tarea",
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

    this.dialogSubscription = this.ref.onClose.subscribe()
  }

  onLogout(){
    this.authService.logout();
  }

  onSidebarChange(){
    if(this.visible === true){
      this.visible = false
      this.sidebarStateChange.emit(this.visible)
    }
    else{
      this.visible = true;
      this.sidebarStateChange.emit(this.visible)
    }
  }

  onChatbarChange(){
    if(this.chatVisibility === true){
      this.chatVisibility = false
      this.sidebarStateChange.emit(this.chatVisibility)
    }
    else{
      this.chatVisibility = true;
      this.sidebarStateChange.emit(this.chatVisibility)
    }
  }

  toggleProjectsMenu(){
    if(this.projectsMenuOpen === true){
      this.projectsMenuOpen = false
      this.sidebarStateChange.emit(this.projectsMenuOpen)
    }
    else{
      this.projectsMenuOpen = true;
      this.sidebarStateChange.emit(this.projectsMenuOpen)
    }
  }

  openDocumentos(){

  }

  cambiarProyecto(idProyecto: number): void {
    this.currentProyecto.cambiarProyecto(idProyecto).subscribe({
        next: (exitoso) => {
            if (exitoso) {
                console.log('Proyecto cambiado a:', idProyecto);
                // Forzar actualización de la vista
                this.cdr.detectChanges();
            }
        },
        error: (err) => console.error('Error:', err)
    });
}

  obtenerProyectoActual() {
    console.log(this.proyectoActual)
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

  crearProyecto() {
  const isMobile = window.innerWidth < 768;

  this.ref = this.dialogService.open(CreateProyectoComponent, {
    header: "Nuevo Proyecto",
    width: isMobile ? '82%' : '30%',
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

  this.dialogSubscription = this.ref.onClose.subscribe(proyectoData => {
    if (!proyectoData) return;

    const nuevoProyecto = {
      nombre: proyectoData.nombre,
      descripcion: proyectoData.descripcion,
      fechaInicio: new Date(),
      fechaFin: proyectoData.fechaFin,
      miembrosProyecto: [{ miembro: { idMiembro: this.currentMember.idMiembro } }]
    };

    this.proyectoService.createProyecto(nuevoProyecto).subscribe({
      next: (proyectoCreado) => {
        console.log("Proyecto creado:", proyectoCreado);
        this.proyectoCreado.emit();
        // 1. Actualizar la lista de proyectos
        this.proyectoService.getProyectosUsuario().subscribe(proyectos => {
          this.proyectosUsuario = proyectos;
          
          // 2. Buscar el proyecto recién creado (por nombre o ID si lo tienes)
          const proyectoNuevo = proyectos.find(p => p.nombreProyecto === proyectoData.nombre);
          
          if (proyectoNuevo) {
            // 3. Establecer como proyecto actual SIEMPRE
            this.currentProyecto.cambiarProyecto(proyectoNuevo.idProyecto).subscribe({
              next: () => {
                console.log('Proyecto establecido como actual:', proyectoNuevo.idProyecto);
                
                // 4. Forzar actualización completa
                this.currentProyecto.proyectoActual$.pipe(take(1)).subscribe(idProyecto => {
                  if (idProyecto) {
                    this.proyectoService.getProyectosById(idProyecto).subscribe({
                      next: (proyecto) => {
                        this.currentProject = proyecto;
                        this.cdr.detectChanges(); // Forzar detección de cambios
                      },
                      error: (err) => console.error('Error al cargar proyecto:', err)
                    });
                  }
                });
              },
              error: (err) => console.error('Error al cambiar proyecto:', err)
            });
          }
        });
      },
      error: (err) => console.error("Error al crear proyecto:", err)
    });
  });
}

  
}
