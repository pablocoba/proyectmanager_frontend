import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
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

@Component({
  selector: 'app-project-manager',
  imports: [
    TabsModule,
    CommonModule,
    TarjetaTareaComponent,
    ButtonModule,
    SlicePipe
  ],
  templateUrl: './project-manager.component.html',
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
  private subscriptions: Subscription = new Subscription();
  
  constructor(
    private miembrosService : MiembroService, 
    private tareaService : TareaService,
    private currentProyecto : CurrentProyectoService,
    private proyectoService : ProyectoService,
    private cdr : ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ){
    if(isPlatformBrowser(this.platformId)){
      this.user = {
        username : localStorage.getItem('username')!,
        token: localStorage.getItem('authToken')!
      }
    }
    // this.tareaService.getTareas().subscribe(tareas=>{
    //   this.tareas = tareas;
    // })
    
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
  
}

