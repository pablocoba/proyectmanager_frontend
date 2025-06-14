import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-create-proyecto',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    DatePickerModule
  ],
  templateUrl: './create-proyecto.component.html',
  styleUrl: './create-proyecto.component.scss'
})
export class CreateProyectoComponent implements OnInit{

  @Output() datosTarea = new EventEmitter<{
      titulo: any,
      descripcion: any,
      fechaFin: any
    }>();

  createProyectoForm: FormGroup = new FormGroup({
    titulo: new FormControl(null, [Validators.required]),
    descripcion: new FormControl(null, [Validators.required]),
    fechaFin: new FormControl(null),
  });
  

  constructor(
    public ref: DynamicDialogRef,
  ){

  }
  ngOnInit(){
      
  }
  onProyectoCreated(){

    const titulo = this.createProyectoForm.get('titulo')?.value
    const descripcion = this.createProyectoForm.get('descripcion')?.value ? '' : '...'
    let date = new Date()
    date.setFullYear(2060);
    const fechaFin = this.createProyectoForm.get('fechaFin')?.value ?? date

    console.log("",fechaFin)
    // Emite los datos al padre al cerrar
    this.ref.close({
      nombre: titulo,
      descripcion: descripcion,
      fechaFin: fechaFin
    });

  }
}
