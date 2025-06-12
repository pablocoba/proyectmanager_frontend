import { Component, OnInit, Output, EventEmitter, Inject, PLATFORM_ID } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { AlertService } from '../commons/services/AlertService';
import { CreateTareaDialogComponent } from './create-tarea-dialog/create-tarea-dialog.component';
import { UserToken } from '../commons/dto/UserToken';
import { AuthService } from '../commons/auth/auth.service';
import { Drawer, DrawerModule } from 'primeng/drawer';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { RippleModule } from 'primeng/ripple';
import { isPlatformBrowser } from '@angular/common';
import { Proyecto } from '../commons/dto/Proyecto';
import { ProyectoService } from '../commons/services/ProyectoService';
import { ProyectoDto } from '../commons/dto/ProyectoDto';

@Component({
  selector: 'app-header',
  imports: [
    ButtonModule,
    MenuModule,
    DrawerModule,
    AvatarModule,
    AvatarGroupModule,
    RippleModule
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
  @Output() sidebarStateChange = new EventEmitter<boolean>();

  user !: UserToken;

  items: MenuItem[] = [
    {
      label: 'Nueva Tarea',
      icon: 'pi pi-plus',
      command: () => this.showCreateTareaDialog()  // Función al hacer clic
    },
    {
      label: 'Nuevo Proyecto',
      icon: 'pi pi-plus', //TODO cambiar el icono
      // command: () => this.importarExcel()
    },
    // {
    //   label: 'Configuración',
    //   icon: 'pi pi-cog',
    //   items: [  // Submenú anidado
    //     { label: 'Preferencias', icon: 'pi pi-sliders-h' },
    //     { label: 'Plantillas', icon: 'pi pi-file' }
    //   ]
    // }
  ];

  ref: DynamicDialogRef | undefined;
  private dialogSubscription: Subscription | undefined; // Para gestionar la suscripción

  currentProject !: ProyectoDto;
  proyectos : ProyectoDto[] = [];
  username !: string;

  constructor(
    private dialogService: DialogService,
    private authService: AuthService,
    private proyectoService : ProyectoService,
    @Inject(PLATFORM_ID) private platformId:Object
  ) {
    if(isPlatformBrowser(this.platformId)){
      this.user = {
        username : localStorage.getItem('username')!,
        token: localStorage.getItem('authToken')!
      }
    }

    this.proyectoService.getProyectos().subscribe(proyectos=>{
      this.proyectos = proyectos;
      this.currentProject = proyectos[0];
    })

  }

  ngOnInit() {

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

}
