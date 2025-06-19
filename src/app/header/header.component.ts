import { Component, OnInit, Output, EventEmitter, Inject, PLATFORM_ID, Input, ChangeDetectorRef, HostListener, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { catchError, distinctUntilChanged, of, Subscription, switchMap, take, tap } from 'rxjs';
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
import { CreateProyectoComponent } from '../create-proyecto/create-proyecto.component';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { TareaDto } from '../commons/dto/TareaDto';
import { TareaService } from '../commons/services/TareaService';
import { EstadoTarea } from '../commons/dto/EstadoTarea';
import { ProjectSettingsComponent } from './project-settings/project-settings.component';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { TooltipModule } from 'primeng/tooltip';

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
    SlicePipe,
    RouterModule,
    OverlayPanelModule, 
    CheckboxModule,
    ReactiveFormsModule,
    FormsModule,
    TooltipModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  providers: [
    DialogService,
    AlertService
  ],
})

export class HeaderComponent implements OnInit {

  visible: boolean = true;
  chatVisibility: boolean = true;
  projectsMenuOpen: boolean = true;
  @Output() sidebarStateChange = new EventEmitter<boolean>();
  @Output() proyectoCreado = new EventEmitter<void>();
  @Output() tareaCreada = new EventEmitter<void>();
  @Input() proyectoActual: number | null = null;
  @Input() proyectosUsuario: MiembroProyectoDto[] | null = null;
  membersPopoverVisible: boolean = false;
  availableMembers: any[] = [];
  selectedMembers: number[] = []; 

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

  
  ref: DynamicDialogRef | undefined;
  private dialogSubscription: Subscription | undefined; // Para gestionar la suscripción

  currentProject !: ProyectoDto | null;
  proyectos: ProyectoDto[] = [];
  username !: string;
  currentMember !: MiembroDto;
  
  @ViewChild('op') op!: OverlayPanel;

  nuevoProyecto: CreateProyectoDto = {
    nombre: "prueba",
    descripcion: "prueba",
    fechaInicio: new Date(),
    fechaFin: new Date(),
    miembrosProyecto: []
  };

  nuevaTarea: TareaDto = {
    titulo: "prueba",
    descripcion: "prueba",
    fechaInicio: new Date(),
    fechaFin: new Date(),
    estado: EstadoTarea.PENDIENTE,
    proyecto: { idProyecto: 0 },
    asignadoA: { idMiembro: 0 },
  }

  constructor(
    private dialogService: DialogService,
    private authService: AuthService,
    private proyectoService: ProyectoService,
    private miembroService: MiembroService,
    public currentProyecto: CurrentProyectoService,
    private cdr: ChangeDetectorRef,
    public router: Router,
    private tareaService: TareaService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {

    if (isPlatformBrowser(this.platformId)) {
      this.user = {
        username: localStorage.getItem('username')!,
        token: localStorage.getItem('authToken')!
      }
    }

    this.proyectoService.getProyectosUsuario().subscribe(proyectos => {
      // Ordenar por idProyecto (ascendente) con verificación de tipos
      this.proyectosUsuario = proyectos.sort((a, b) => {
        const idA = Number(a.idProyecto); // Convierte a número por si acaso
        const idB = Number(b.idProyecto);

        if (isNaN(idA) || isNaN(idB)) {
          return a.nombreProyecto.localeCompare(b.nombreProyecto); // Fallback a nombre
        }
        return idA - idB; // Orden numérico
      });

      console.log("Proyectos ordenados:", this.proyectosUsuario);
    });

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
    this.checkScreenSize();
  }

  // Escucha cambios en el tamaño de la pantalla
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    const isMobile = window.innerWidth < 1024;
    this.chatVisibility = !isMobile;
    this.projectsMenuOpen = !isMobile;
    this.visible = !isMobile;
  }

  private loadCurrentMember(): void {
    this.miembroService.getMiembroActual().subscribe({
      next: (miembro: MiembroDto | null) => {
        if (miembro) {
          this.currentMember = miembro;
          console.log('Miembro actual cargado:', miembro);
        } else {
          console.warn('No se encontró el miembro para el usuario actual');
          // Puedes manejar este caso como prefieras, por ejemplo:
          // this.alertService.warning('No se encontró tu información de miembro');
        }
        this.cdr.markForCheck(); // Actualizar la vista si es necesario
      },
      error: (err) => {
        console.error('Error al cargar miembro actual:', err);
        // Manejo de errores según necesites
        // this.alertService.error('Error al cargar tu información de miembro');
      }
    });
  }

  actualizarMenuItems() {
    setTimeout(() => { // Ejecuta en el siguiente ciclo de detección de cambios
      const tieneProyecto = !!this.currentProject;

      this.items = [
        ...(tieneProyecto ? [{
          label: 'Nueva Tarea',
          icon: 'pi pi-plus',
          command: () => this.crearTarea()
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

  crearTarea() {

    const isMobile = window.innerWidth < 768;

    this.ref = this.dialogService.open(CreateTareaDialogComponent, {
      header: "Nueva Tarea",
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

    this.dialogSubscription = this.ref.onClose.subscribe(tareaData => {
      if (!tareaData) return; // Si se cerró el diálogo sin datos

      this.currentProyecto.proyectoActual$.pipe(take(1)).subscribe(idProyecto => {
        if (!idProyecto) {
          console.error('No hay proyecto seleccionado');
          return;
        }

        const nuevaTarea: TareaDto = {
          titulo: tareaData.titulo,
          descripcion: tareaData.descripcion,
          fechaInicio: tareaData.fechaInicio,
          fechaFin: tareaData.fechaFin,
          estado: tareaData.estado || EstadoTarea.PENDIENTE,
          proyecto: {
            idProyecto: idProyecto
          },
          asignadoA: {
            idMiembro: tareaData.asignadoA?.idMiembro || this.currentMember.idMiembro
          }
        };

        this.tareaService.createTarea(nuevaTarea).subscribe({
          next: (tareaCreada) => {
            console.log("Tarea creada:", tareaCreada);
            this.tareaCreada.emit(); // Notificar a los componentes padres

            // Aquí puedes añadir lógica adicional si es necesario
            // Por ejemplo, mostrar un mensaje de éxito
          },
          error: (err) => {
            console.error("Error al crear tarea:", err.error);
            // Aquí puedes mostrar un mensaje de error al usuario
          }
        });
      });
    });
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

          // Actualizar la lista de proyectos con el mismo ordenamiento
          this.proyectoService.getProyectosUsuario().subscribe(proyectos => {
            // Aplicar el mismo ordenamiento que en la carga inicial
            this.proyectosUsuario = proyectos.sort((a, b) => {
              const idA = Number(a.idProyecto);
              const idB = Number(b.idProyecto);

              if (isNaN(idA) || isNaN(idB)) {
                return a.nombreProyecto.localeCompare(b.nombreProyecto);
              }
              return idA - idB;
            });

            // Resto de la lógica para establecer el proyecto actual
            const proyectoNuevo = this.proyectosUsuario.find(p => p.nombreProyecto === proyectoData.nombre);

            if (proyectoNuevo) {
              this.currentProyecto.cambiarProyecto(proyectoNuevo.idProyecto).subscribe({
                next: () => {
                  console.log('Proyecto establecido como actual:', proyectoNuevo.idProyecto);

                  this.currentProyecto.proyectoActual$.pipe(take(1)).subscribe(idProyecto => {
                    if (idProyecto) {
                      this.proyectoService.getProyectosById(idProyecto).subscribe({
                        next: (proyecto) => {
                          this.currentProject = proyecto;
                          this.cdr.detectChanges();
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

  onLogout() {
    this.authService.logout();
  }

  onSidebarChange() {
    if (this.visible === true) {
      this.visible = false
      this.sidebarStateChange.emit(this.visible)
    }
    else {
      this.visible = true;
      this.sidebarStateChange.emit(this.visible)
    }
  }

  onChatbarChange() {
    if (this.chatVisibility === true) {
      this.chatVisibility = false
      this.sidebarStateChange.emit(this.chatVisibility)
    }
    else {
      this.chatVisibility = true;
      this.sidebarStateChange.emit(this.chatVisibility)
    }
  }

  toggleProjectsMenu() {
    if (this.projectsMenuOpen === true) {
      this.projectsMenuOpen = false
      this.sidebarStateChange.emit(this.projectsMenuOpen)
    }
    else {
      this.projectsMenuOpen = true;
      this.sidebarStateChange.emit(this.projectsMenuOpen)
    }
  }

  openDocumentos() {

  }

  cambiarProyecto(idProyecto: number): void {
    this.currentProyecto.cambiarProyecto(idProyecto).subscribe({
      next: (exitoso) => {
        if (exitoso) {
          // Forzar actualización de la vista
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Error:', err)
    });
  }

  openProjectSettings() {
    if (!this.currentProject) return;

    const isMobile = window.innerWidth < 768;

    this.proyectoService.getProyectoCompletoById(this.currentProject.idProyecto).subscribe({
      next: (proyectoCompleto: Proyecto) => {
        const dialogConfig = {
          header: 'Configuración del Proyecto',
          width: isMobile ? '90%' : '30%',
          height: 'auto',
          modal: true,
          closable: true,
          contentStyle: {
            'max-height': '80vh',
            overflow: 'auto',
            'padding': '0'
          },
          baseZIndex: 10000,
          data: {
            currentSettings: {
              nombre: this.currentProject?.nombre,
              descripcion: this.currentProject?.descripcion,
              fechaInicio: this.currentProject?.fechaInicio,
              fechaFin: this.currentProject?.fechaFin
                ? (typeof this.currentProject.fechaFin === 'string'
                    ? new Date(this.currentProject.fechaFin)
                    : this.currentProject.fechaFin)
                : new Date(),
              idProyecto: this.currentProject?.idProyecto,
            }
          }
        };

        this.ref = this.dialogService.open(ProjectSettingsComponent, dialogConfig);

        this.ref.onClose.subscribe((result: any) => {
          if (result && result.action === 'save') {
            console.log('Cambios recibidos:', result.changes);

            const miembrosProyecto = proyectoCompleto.miembros.map(miembro => ({
              miembro: { idMiembro: miembro.idMiembro } // Formato exacto requerido
            }));

            const updateDto: CreateProyectoDto = {
              nombre: result.changes.nombre || this.currentProject?.nombre,
              descripcion: result.changes.descripcion || this.currentProject?.descripcion,
              fechaInicio: this.currentProject?.fechaInicio
                ? typeof this.currentProject.fechaInicio === 'string'
                  ? new Date(this.currentProject.fechaInicio)
                  : this.currentProject.fechaInicio
                : new Date(),
              fechaFin: result.changes.fechaFin || this.currentProject?.fechaFin,
              miembrosProyecto: miembrosProyecto
            };

            if (this.currentProject?.idProyecto) {
              this.proyectoService.updateProyecto(this.currentProject.idProyecto, updateDto)
                .subscribe({
                  next: (updatedProject) => {
                    console.log('Proyecto actualizado:', updatedProject);

                    // 1. Actualizar currentProject
                    this.currentProject = {
                      ...this.currentProject,
                      ...updatedProject
                    };

                    // 2. Actualizar la lista de proyectosUsuario
                    if (this.proyectosUsuario) {
                      this.proyectosUsuario = this.proyectosUsuario.map(proyecto => {
                        if (proyecto.idProyecto === this.currentProject?.idProyecto) {
                          return {
                            ...proyecto,
                            nombreProyecto: updatedProject.nombre
                          };
                        }
                        return proyecto;
                      });
                    }

                    // 3. Forzar actualización de la vista
                    this.cdr.detectChanges();
                  },
                  error: (err) => {
                    console.error('Error al actualizar proyecto:', err);
                  }
                });
            }
          } else if (result?.action === 'no-changes') {
            console.log('No hubo cambios válidos');
          } else if (result?.action === 'delete') {
            const deletedProjectId = this.currentProject?.idProyecto;

            if (deletedProjectId !== undefined) {
                this.proyectoService.deleteProyecto(deletedProjectId).subscribe({
                next: () => {
                  // Después de eliminar, actualizar la lista de proyectos
                  this.proyectoService.getProyectosUsuario().subscribe(proyectos => {
                    this.proyectosUsuario = proyectos.sort((a, b) => {
                      const idA = Number(a.idProyecto);
                      const idB = Number(b.idProyecto);
                      return idA - idB;
                    });

                    // Si el proyecto eliminado era el actual
                    if (this.currentProject?.idProyecto === deletedProjectId) {
                      if (this.proyectosUsuario.length > 0) {
                        // Seleccionar el primer proyecto de la lista
                        this.cambiarProyecto(this.proyectosUsuario[0].idProyecto);
                      } else {
                        // No hay más proyectos, limpiar el estado
                        this.currentProject = null;
                      }
                    }

                    this.cdr.detectChanges();
                  });
                },
                error: (err) => {
                  console.error('Error al obtener proyecto completo:', err);
                }
              });
            } else {
              console.error('No se pudo eliminar el proyecto: idProyecto es undefined');
            }


          }
        })
      }
    })
  }
  toDocuments(){
    this.router.navigate(['/docs']);
  }

  toUserPage(){
    this.router.navigate(['/user']);
  }

  agregarMiembrosAlProyecto(miembrosIds: number[]) {
  if (!this.currentProject?.idProyecto) {
    console.error('No hay proyecto seleccionado');
    return;
  }

  const proyectoId = this.currentProject.idProyecto;

  // 1. Obtener miembros actuales (versión optimizada)
  this.proyectoService.getProyectoCompletoById(proyectoId).pipe(
    switchMap(proyectoCompleto => {
      // 2. Crear lista de IDs actuales
      const idsActuales = new Set(proyectoCompleto.miembros.map(m => m.idMiembro));

      // 3. Filtrar y crear nuevos miembros
      const nuevosMiembros = miembrosIds
        .filter(id => !idsActuales.has(id))
        .map(id => ({ miembro: { idMiembro: id } }));

      if (nuevosMiembros.length === 0) {
        console.log('No hay miembros nuevos para agregar');
        return of(null);
      }

      // 4. Crear DTO de actualización
      const updateDto: CreateProyectoDto = {
        nombre: this.currentProject?.nombre!,
        descripcion: this.currentProject?.descripcion!,
        fechaInicio: new Date(this.currentProject?.fechaInicio!),
        fechaFin: this.currentProject && this.currentProject.fechaFin ? new Date(this.currentProject.fechaFin) : new Date(),
        miembrosProyecto: [
          ...proyectoCompleto.miembros.map(m => ({ miembro: { idMiembro: m.idMiembro } })),
          ...nuevosMiembros
        ]
      };

      console.log('DTO de actualización:', JSON.stringify(updateDto, null, 2));

      // 5. Enviar actualización
      return this.proyectoService.updateProyecto(proyectoId, updateDto).pipe(
        tap(() => console.log('Actualización enviada al backend')),
        catchError(error => {
          console.error('Error en la actualización:', error);
          throw error;
        })
      );
    }),
    // 6. Refrescar datos solo si la actualización fue exitosa
    switchMap(() => this.proyectoService.getProyectoCompletoById(proyectoId))
  ).subscribe({
    next: (proyectoActualizado) => {
      if (!proyectoActualizado) return;

      console.log('Proyecto actualizado:', proyectoActualizado);

      // 8. Actualizar lista de miembros disponibles
      this.loadAvailableMembers();
      
      // 9. Forzar actualización de la vista
      this.cdr.detectChanges();
    },
    error: (error) => console.error('Error en el proceso completo:', error)
  });
}

// Método auxiliar para parsear fechas
private parseDate(date: any): Date {
  if (!date) return new Date();
  return date instanceof Date ? date : new Date(date);
}

// Método para refrescar los datos del proyecto
private refreshProjectData(proyectoId: number) {
  // 1. Obtener proyecto completo
  this.proyectoService.getProyectoCompletoById(proyectoId).subscribe({
    next: (proyectoActualizado) => {
      console.log('Proyecto actualizado completo:', proyectoActualizado);
      
      // 2. Actualizar currentProject
      this.currentProject = {
        ...this.currentProject,
        ...proyectoActualizado,
        fechaInicio: proyectoActualizado.fechaInicio instanceof Date
          ? proyectoActualizado.fechaInicio.toISOString()
          : proyectoActualizado.fechaInicio,
        fechaFin: proyectoActualizado.fechaFin instanceof Date
          ? proyectoActualizado.fechaFin.toISOString()
          : proyectoActualizado.fechaFin
      };

      // 3. Actualizar proyectosUsuario si es necesario
      if (this.proyectosUsuario) {
        this.proyectosUsuario = this.proyectosUsuario.map(p => 
          p.idProyecto === proyectoId 
            ? { ...p, miembros: proyectoActualizado.miembros } 
            : p
        );
      }

      // 4. Recargar miembros disponibles
      this.loadAvailableMembers();
      
      // 5. Forzar actualización de la vista
      this.cdr.detectChanges();
      
      // 6. Mostrar feedback al usuario
      console.log('Miembros agregados correctamente');
    },
    error: (error) => {
      console.error('Error al obtener proyecto actualizado:', error);
    }
  });
}

loadAvailableMembers() {
  if (!this.currentProject?.idProyecto) {
    console.log('No hay proyecto seleccionado');
    return;
  }

  console.log('Cargando miembros disponibles...');
  
  this.miembroService.getMiembros().subscribe({
    next: (allMembers) => {
      console.log('Todos los miembros:', allMembers);
      
      this.proyectoService.getProyectoCompletoById(this.currentProject!.idProyecto).subscribe({
        next: (proyecto) => {
          const currentMemberIds = proyecto.miembros.map(m => m.idMiembro);
          console.log('Miembros actuales en proyecto:', currentMemberIds);
          
          this.availableMembers = allMembers
            .filter(member => !currentMemberIds.includes(member.idMiembro))
            .map(member => ({
              id: member.idMiembro,
              name: member.nombreUsuario || member.nombreUsuario || 'Sin nombre',
              selected: false
            }));

          console.log('Miembros disponibles para agregar:', this.availableMembers);
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error al obtener proyecto:', err)
      });
    },
    error: (err) => console.error('Error al obtener miembros:', err)
  });
}

updateSelectedMembers(memberId: number, isChecked: boolean) {
  if (isChecked) {
    if (!this.selectedMembers.includes(memberId)) {
      this.selectedMembers.push(memberId);
    }
  } else {
    this.selectedMembers = this.selectedMembers.filter(id => id !== memberId);
  }
}

confirmAddMembers() {
  console.log('Confirmando agregar miembros:', this.selectedMembers);
  this.agregarMiembrosAlProyecto(this.selectedMembers);
  this.op.hide();
  this.selectedMembers = []; // Limpiar selección
  
  // Resetear los checkboxes
  this.availableMembers.forEach(m => m.selected = false);
}

toggleMembersPopover(event: Event) {
  this.op.toggle(event); // Usa directamente el overlayPanel
  this.loadAvailableMembers();
}

}


