import { Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { TareaService } from '../../commons/services/TareaService';
import { TareaDto } from '../../commons/dto/TareaDto';
import { EstadoTarea } from '../../commons/dto/EstadoTarea';
import { ProyectoService } from '../../commons/services/ProyectoService';
import { ProyectoDto } from '../../commons/dto/ProyectoDto';
import { MiembroService } from '../../commons/services/MiembroService';
import { Miembro } from '../../commons/dto/Miembro';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-create-tarea-dialog',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    DatePickerModule
  ],
  templateUrl: './create-tarea-dialog.component.html',
  styleUrl: './create-tarea-dialog.component.scss',
  encapsulation: ViewEncapsulation.None
})

export class CreateTareaDialogComponent implements OnInit{

  createTareaForm: FormGroup = new FormGroup({
      titulo: new FormControl(null, [Validators.required]),
      descripcion: new FormControl(null, [Validators.required]),
      fechaFin: new FormControl(null, [Validators.required]),
  });

  nuevaTarea !: TareaDto;
  currentProyect !: ProyectoDto;
  miembros : Miembro[] = [];
  currentMiembro !: Miembro;
  usernameToFilter!:string;
  constructor(
    private tareaService : TareaService,
    private proyectoService : ProyectoService,
    private miembroService : MiembroService,
    @Inject(PLATFORM_ID) private platformId: Object
  ){

    this.proyectoService.getProyectosById(1).subscribe(proyecto=>{
      this.currentProyect = proyecto;
    })
    

  }

  ngOnInit(){

  this.miembroService.getMiembros().subscribe(miembros => {

    this.miembros = miembros; // Asigna todos los miembros primero

      // Obtén el nombre de usuario de localStorage una sola vez y conviértelo a minúsculas
      if(isPlatformBrowser(this.platformId)){
            this.usernameToFilter = localStorage.getItem('username')?.toLowerCase()!;
    }

      if (this.usernameToFilter) { // Solo si tenemos un username para filtrar
        this.miembros = this.miembros.filter(miembro => {
          // Asegúrate de que miembro y miembro.nombreUsuario existen
          if (miembro && typeof miembro.nombreUsuario === 'string' && miembro.id !== undefined) {
            // Realiza la comparación
            return miembro.nombreUsuario.toLowerCase().includes(this.usernameToFilter);
          }
          return false; // Descarta si no cumple las condiciones de tipo o null/undefined
        });
      } else {
        // Si no hay username en localStorage, ¿qué debería pasar?
        // Podrías dejar this.miembros como está o vaciarlo, dependiendo de tu lógica.
        console.warn("No se encontró nombre de usuario en localStorage para filtrar miembros.");
      }

      // Ahora, 'this.miembros' contendrá solo los miembros filtrados
      console.log('Miembros filtrados:', this.miembros);
    });
  }

  onTareaCreated(){
    const titulo = this.createTareaForm.get('titulo')?.value
    const descripcion = this.createTareaForm.get('descripcion')?.value
    let fechaInicio = new Date()
    fechaInicio.setMinutes(fechaInicio.getMinutes()+1);
    const fechaFin = this.createTareaForm.get('fechaFin')?.value
    const estadoTarea = EstadoTarea.PENDIENTE;
    const proyecto = this.currentProyect
    const asignadoA = this.currentMiembro;

    this.nuevaTarea = {
      titulo: titulo,
      descripcion: descripcion,
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
      estadoTarea: estadoTarea,
      proyecto:proyecto,
      asignadoA: asignadoA
    }
    console.log("nueva tarea::",this.nuevaTarea)

    this.tareaService.createTarea(this.nuevaTarea).subscribe(nuevaTarea=>{
      console.log("tarea creada")
    })
  }


}
