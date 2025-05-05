import { Component } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { SelectItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { TarjetaProyectoComponent } from '../tarjeta-proyecto/tarjeta-proyecto.component';

@Component({
  selector: 'app-project-manager',
  imports: [
    TabsModule,
    CommonModule
  ],
  templateUrl: './project-manager.component.html',
  styleUrl: './project-manager.component.scss'
})
export class ProjectManagerComponent {
  //hay que cambiarlo por el name del proyecto en bbdd
  mockups: any[] = [
    { value: 0, title: 'Últimos proyectos', contentComponent: TarjetaProyectoComponent },
    { value: 1, title: 'En progreso', contentComponent: TarjetaProyectoComponent },
    { value: 2, title: 'Fecha límite', contentComponent: TarjetaProyectoComponent },
    { value: 3, title: 'Finalizados', contentComponent: TarjetaProyectoComponent },
  ]

  activeTabIndex: number = 0; 
}
