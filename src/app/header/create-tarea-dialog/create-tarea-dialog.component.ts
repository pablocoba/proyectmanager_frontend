import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-create-tarea-dialog',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
  ],
  templateUrl: './create-tarea-dialog.component.html',
  styleUrl: './create-tarea-dialog.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class CreateTareaDialogComponent {

    createTareaForm: FormGroup = new FormGroup({
      titulo: new FormControl(null, [Validators.required]),
      descripcion: new FormControl(null, [Validators.required]),
      fechaFin: new FormControl(null, [Validators.required]),
  });

  onTareaCreated(){

  }
}
