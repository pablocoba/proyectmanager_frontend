import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button, ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-project-settings',
  templateUrl: './project-settings.component.html',
  imports:[
    CommonModule,
    InputTextModule,
    DatePickerModule,
    ButtonModule,
    ReactiveFormsModule,
    CheckboxModule
  ]
})
export class ProjectSettingsComponent implements OnInit {
  projectSettings: any = {};

  updateProyectoForm: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    fechaFin: new FormControl(null, [Validators.required]),
    checkNombre: new FormControl(false),
    checkDesc: new FormControl(false),
    checkFecha: new FormControl(false),
  });

  checkNombre : boolean = true;
  checkDesc : boolean = true;
  checkFecha : boolean = true;

  constructor(
    public ref: DynamicDialogRef, 
    public config: DynamicDialogConfig
  ) {}

  ngOnInit() {
    if (this.config.data) {
    this.projectSettings = { ...this.config.data.currentSettings };
    // Inicializa con formato de fecha correcto
    const fechaFin = this.projectSettings.fechaFin ? new Date(this.projectSettings.fechaFin) : null;
    
    this.updateProyectoForm.patchValue({
      nombre: this.projectSettings.nombre,
      descripcion: this.projectSettings.descripcion,
      fechaFin: fechaFin,  // Usa el objeto Date directamente
      checkNombre: false,
      checkDesc: false,
      checkFecha: false
    });
  }

    // Configura los listeners para los cambios en los checkboxes
    this.setupCheckboxListeners();
  }

  private setupCheckboxListeners(): void {
    // Listener para el checkbox de título
    this.updateProyectoForm.get('checkNombre')?.valueChanges.subscribe((value) => {
      const control = this.updateProyectoForm.get('nombre');
      value ? control?.enable() : control?.disable();
    });

    // Listener para el checkbox de descripción
    this.updateProyectoForm.get('checkDesc')?.valueChanges.subscribe((value) => {
      const control = this.updateProyectoForm.get('descripcion');
      value ? control?.enable() : control?.disable();
    });

    // Listener para el checkbox de fecha
    this.updateProyectoForm.get('checkFecha')?.valueChanges.subscribe((value) => {
      const control = this.updateProyectoForm.get('fechaFin');
      value ? control?.enable() : control?.disable();
    });

    // Deshabilita inicialmente todos los campos
    this.updateProyectoForm.get('nombre')?.disable();
    this.updateProyectoForm.get('descripcion')?.disable();
    this.updateProyectoForm.get('fechaFin')?.disable();
  }

  saveSettings() {
  // Obtener los valores actuales del formulario
  const formValues = this.updateProyectoForm.getRawValue();
  
  // Preparar objeto con solo los cambios aprobados
  const changes: any = {};
  
  // Verificar cada campo modificado
  if (formValues.checkNombre && this.updateProyectoForm.get('nombre')?.dirty) {
    changes.nombre = formValues.nombre;
  }
  
  if (formValues.checkDesc && this.updateProyectoForm.get('descripcion')?.dirty) {
    changes.descripcion = formValues.descripcion;
  }
  
  if (formValues.checkFecha && this.updateProyectoForm.get('fechaFin')?.dirty) {
    changes.fechaFin = formValues.fechaFin;
  }

  // Preparar resultado final
  const result = {
    changes: changes,  // Solo los campos modificados y aprobados
    original: this.projectSettings,  // Datos originales por referencia
    action: Object.keys(changes).length > 0 ? 'save' : 'no-changes'
  };

  // Cerrar el diálogo y devolver los cambios
  this.ref.close(result);
}

confirmDelete(){
  const result = {
    action : 'delete'
  }
  if(confirm('¿Deseas eliminar el proyecto? Esta acción no se puede revertir.')){
    this.ref.close(result)
  }
}

  cancel() {
    this.ref.close(); // Cierra sin devolver datos
  }
}