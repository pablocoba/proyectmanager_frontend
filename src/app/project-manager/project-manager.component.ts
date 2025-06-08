import { Component } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { SelectItem } from 'primeng/api';
import { CommonModule } from '@angular/common';

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
    ButtonModule
  ],
  templateUrl: './project-manager.component.html',
  styleUrl: './project-manager.component.scss'
})

export class ProjectManagerComponent {

  miembros : Miembro[] = [];
  activeTabIndex: number = 0; 
  tareas : Tarea[] = [];

  constructor(private miembrosService : MiembroService, private tareaService : TareaService){
    this.tareaService.getTareas().subscribe(tareas=>{
      this.tareas = tareas;
      console.log(this.tareas)
    })
  }

  
}
