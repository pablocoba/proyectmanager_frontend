import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostListener, Inject, Input, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { SelectItem } from 'primeng/api';
import { CommonModule, isPlatformBrowser, SlicePipe } from '@angular/common';

import { MiembroService } from '../commons/services/MiembroService';
import { Miembro } from '../commons/dto/Miembro';
import { TarjetaTareaComponent } from '../tarjeta-tarea/tarjeta-tarea.component';
import { TareaService } from '../commons/services/TareaService';
import { Tarea } from '../commons/dto/Tarea';
import { ButtonModule } from 'primeng/button';
import { ProyectoDto } from '../commons/dto/ProyectoDto';
import { CurrentProyectoService } from '../commons/services/CurrentProyectoService';
import { ProyectoService } from '../commons/services/ProyectoService';
import { UserToken } from '../commons/dto/UserToken';
import { TareaDto } from '../commons/dto/TareaDto';
import { Subscription, take } from 'rxjs';
import { TooltipModule } from 'primeng/tooltip';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EstadoTarea } from '../commons/dto/EstadoTarea';
import { CreateTareaDialogComponent } from '../header/create-tarea-dialog/create-tarea-dialog.component';
import { MiembroDto } from '../commons/dto/MiembroDto';

@Component({
  selector: 'app-project-manager',
  imports: [
    TabsModule,
    CommonModule,
    TarjetaTareaComponent,
    ButtonModule,
    SlicePipe,
    TooltipModule
  ],
  templateUrl: './project-manager.component.html',
  providers:[
    DialogService
  ],
  styleUrl: './project-manager.component.scss'
})

export class ProjectManagerComponent implements OnInit{
  @Input() proyectoActual: number | null = null;
  @Input() tamano: boolean | null = null;
  
  miembros : Miembro[] = [];
  activeTabIndex: number = 0; 
  tareas : Tarea[] = [];
  currentProject !: ProyectoDto;
  user !: UserToken; 
  isMobile : boolean = false;
  ampliarTareas : boolean = false;
  ref: DynamicDialogRef | undefined;
  private dialogSubscription: Subscription | undefined; // Para gestionar la suscripción
  currentMember !: MiembroDto;
  @Output() tareaCreada = new EventEmitter<void>();

  @HostListener('window:resize')
  checkScreenSize() {
    this.isMobile = window.innerWidth < 1024;
    this.cdr.detectChanges(); // Forzar actualización de vista
  }

  private subscriptions: Subscription = new Subscription();
  
  constructor(
    private miembrosService : MiembroService, 
    private tareaService : TareaService,
    private currentProyecto : CurrentProyectoService,
    private proyectoService : ProyectoService,
    private cdr : ChangeDetectorRef,
    private dialogService: DialogService,
    private miembroService : MiembroService,
    @Inject(PLATFORM_ID) private platformId: Object
  ){
    if(isPlatformBrowser(this.platformId)){
      this.user = {
        username : localStorage.getItem('username')!,
        token: localStorage.getItem('authToken')!
      }
    }
    
    this.subscriptions.add(
      this.currentProyecto.proyectoActual$.subscribe(idProyecto => {
        if (idProyecto !== null) {
          this.loadTareas(idProyecto);
          this.loadProyecto(idProyecto);
        }
      })
    );

    // Suscripción a actualizaciones de tareas
    this.subscriptions.add(
      this.tareaService.tareasUpdated$.subscribe(() => {
        this.currentProyecto.proyectoActual$.pipe(take(1)).subscribe(idProyecto => {
          if (typeof idProyecto === 'number') {
            this.loadTareas(idProyecto);
          }
        });
      })
    );
  }

  ampliar(){
    if(!this.ampliarTareas){
      this.ampliarTareas = true;
    }
    else{
      this.ampliarTareas = false;
    }
  }

  private loadProyecto(idProyecto: number): void {
    this.proyectoService.getProyectosById(idProyecto).subscribe({
      next: (proyecto) => {
        this.currentProject = proyecto;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar proyecto:', err)
    });
  }

  ngOnInit(): void {
    this.loadCurrentMember()
  }
  
  
  private loadTareas(idProyecto: number): void {

    
    this.tareaService.getTareasByProyecto(idProyecto).subscribe({
      next: (tareas) => {
        this.tareas = tareas;

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar tareas:', err);

        this.tareas = [];
        this.cdr.detectChanges();
      }
    });
  }

  // Método para manejar la actualización cuando se crea una nueva tarea
  onTareaCreada(event: {idProyecto: number, tarea: TareaDto}): void {
    if (event.idProyecto === this.proyectoActual) {
      this.loadTareas(event.idProyecto);
    }
  }
  recargarTareas() {
    if (this.proyectoActual) {
        this.loadTareas(this.proyectoActual);
    }
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

            },
            error: (err) => {
              console.error("Error al crear tarea:", err.error);
              // Aquí puedes mostrar un mensaje de error al usuario
            }
          });
        });
      });
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

}

