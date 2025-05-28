import { Component } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { SelectItem } from 'primeng/api';
import { CommonModule } from '@angular/common';

import { MiembroService } from '../commons/services/MiembroService';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { Miembros } from '../commons/dto/Miembros';
import { SeccionesProjectManagerComponent } from './secciones-project-manager/secciones-project-manager.component';
import { TarjetaProyectoComponent } from '../tarjeta-proyecto/tarjeta-proyecto.component';

@Component({
  selector: 'app-project-manager',
  imports: [
    TabsModule,
    CommonModule,
    TarjetaProyectoComponent
  ],
  templateUrl: './project-manager.component.html',
  styleUrl: './project-manager.component.scss'
})

export class ProjectManagerComponent {
  //hay que cambiarlo por el name del proyecto en bbdd
  mockups: any[] = [
    { value: 0, title: 'Últimos proyectos', contentComponent: SeccionesProjectManagerComponent },
    { value: 1, title: 'En progreso', contentComponent: SeccionesProjectManagerComponent },
    { value: 2, title: 'Fecha límite', contentComponent: SeccionesProjectManagerComponent },
    { value: 3, title: 'Finalizados', contentComponent: SeccionesProjectManagerComponent },
  ]
  miembros : Miembros[] = [];
  activeTabIndex: number = 0; 
  
  constructor(private miembrosService : MiembroService){

  }
}
