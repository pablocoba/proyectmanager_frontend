import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'app-tarjeta-proyecto',
  imports: [
    CardModule,
    ButtonModule,
    ProgressBarModule
    
  ],
  templateUrl: './tarjeta-proyecto.component.html',
  styleUrl: './tarjeta-proyecto.component.scss'
})
export class TarjetaProyectoComponent {
  
}
