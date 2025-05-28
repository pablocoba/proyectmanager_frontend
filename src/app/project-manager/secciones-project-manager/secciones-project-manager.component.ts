import { Component } from '@angular/core';
import { TarjetaProyectoComponent } from '../../tarjeta-proyecto/tarjeta-proyecto.component';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-secciones-project-manager',
  imports: [
    TarjetaProyectoComponent,
    CardModule,
    CommonModule,
    ProgressBarModule,
    ButtonModule
  ],
  templateUrl: './secciones-project-manager.component.html',
  styleUrl: './secciones-project-manager.component.scss'
})
export class SeccionesProjectManagerComponent {
  
}
