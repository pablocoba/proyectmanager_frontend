import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { SelectItem } from 'primeng/api';
import { CommonModule, isPlatformBrowser, SlicePipe } from '@angular/common';

import { MiembroService } from '../commons/services/MiembroService';
import { Miembro } from '../commons/dto/Miembro';
import { TarjetaTareaComponent } from '../tarjeta-tarea/tarjeta-tarea.component';
import { TareaService } from '../commons/services/TareaService';
import { Tarea } from '../commons/dto/Tarea';
import { ButtonModule } from 'primeng/button';

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

  miembros : Miembro[] = [];
  activeTabIndex: number = 0; 
  tareas : Tarea[] = [];

  constructor(
    private miembrosService : MiembroService, 
    private tareaService : TareaService,
    @Inject(PLATFORM_ID) private platformId: Object
  ){
    this.tareaService.getTareas().subscribe(tareas=>{
      this.tareas = tareas;
      console.log(this.tareas)
    })
  }

  ngOnInit(): void {
  }
}
