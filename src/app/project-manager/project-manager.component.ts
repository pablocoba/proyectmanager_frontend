import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
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
  miembros : Miembro[] = [];
  activeTabIndex: number = 0; 
  tareas : Tarea[] = [];
  currentProject !: ProyectoDto;
  user !: UserToken; 
  
  constructor(
    private miembrosService : MiembroService, 
    private tareaService : TareaService,
    private currentProyecto : CurrentProyectoService,
    private proyectoService : ProyectoService,
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
    
    this.currentProyecto.proyectoActual$.subscribe(idProyecto => {
      console.log('ID Proyecto recibido:', idProyecto);
      
      // 3. Si hay un proyecto seleccionado
      if (idProyecto !== null) {
        this.tareaService.getTareasByProyectoActivo(idProyecto).subscribe({
          next: (tareas)=>{
            this.tareas = tareas;
            console.log("tareas::::",this.tareas)
          },
          error: (err) => {
            console.error('Error al cargar tareas:', err);
          }
        })
        this.proyectoService.getProyectosById(idProyecto).subscribe({
          next: (proyecto) => {
            this.currentProject = proyecto;
          },
          error: (err) => {
            console.error('Error al cargar proyecto:', err);

          }
        });
      } else {
        console.log('No hay proyecto seleccionado');
      }
    });
  }

  ngOnInit(): void {
  }
  
}
