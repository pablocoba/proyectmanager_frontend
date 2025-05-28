import { Component, ViewEncapsulation } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProyectoService } from '../commons/services/ProyectoService';
import { Proyecto } from '../commons/dto/Proyecto';

@Component({
  selector: 'app-tarjeta-proyecto',
  imports: [
    CardModule,
    ButtonModule,
    ProgressBarModule
  ],
  templateUrl: './tarjeta-proyecto.component.html',
  styleUrl: './tarjeta-proyecto.component.scss',
})

export class TarjetaProyectoComponent {

  proyectos : Proyecto[] = [];


  constructor (private proyectoService : ProyectoService) {
    // this.proyectoService.getProyectos().subscribe((proyectos)=>{
    //   this.proyectos = proyectos;
    //   console.log(proyectos)
    // })
  }
}
