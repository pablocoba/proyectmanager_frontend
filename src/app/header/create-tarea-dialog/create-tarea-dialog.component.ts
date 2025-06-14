import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { isPlatformBrowser } from '@angular/common';
import { MiembroService } from '../../commons/services/MiembroService';
import { Miembro } from '../../commons/dto/Miembro';
import { EstadoTarea } from '../../commons/dto/EstadoTarea';

@Component({
  selector: 'app-create-tarea-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    DatePickerModule,
    DropdownModule
  ],
  templateUrl: './create-tarea-dialog.component.html',
  styleUrls: ['./create-tarea-dialog.component.scss']
})
export class CreateTareaDialogComponent implements OnInit {
  createTareaForm: FormGroup = new FormGroup({
    titulo: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    fechaFin: new FormControl(null, [Validators.required]),
    asignadoA: new FormControl(null)
  });

  miembros: Miembro[] = [];
  currentMiembro!: Miembro;

  constructor(
    public ref: DynamicDialogRef,
    private miembroService: MiembroService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.loadMiembros();
  }

  loadMiembros() {
    this.miembroService.getMiembros().subscribe(miembros => {
      this.miembros = miembros;
      
      // Buscar el miembro actual basado en el usuario logueado
      if (isPlatformBrowser(this.platformId)) {
        const username = localStorage.getItem('username');
        if (username) {
          this.currentMiembro = this.miembros.find(m => m.nombreUsuario === username)!;
          this.createTareaForm.patchValue({
            asignadoA: this.currentMiembro.idMiembro
          });
        }
      }
    });
  }

  confirmar() {
    if (this.createTareaForm.invalid) {
      return;
    }
    let fechaInicio = new Date();
    fechaInicio.setMinutes(fechaInicio.getMinutes()+1)
    const formValue = this.createTareaForm.value;
    const tareaData = {
      titulo: formValue.titulo,
      descripcion: formValue.descripcion,
      fechaInicio: fechaInicio, // Fecha actual como inicio
      fechaFin: formValue.fechaFin,
      estado: EstadoTarea.PENDIENTE,
      asignadoA: formValue.asignadoA || this.currentMiembro
    };

    console.log(tareaData)
    this.ref.close(tareaData);
  }

  cancelar() {
    this.ref.close();
  }
}
