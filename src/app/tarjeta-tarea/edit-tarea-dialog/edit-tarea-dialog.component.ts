import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';
import { TareaDto } from '../../commons/dto/TareaDto';
import { MiembroService } from '../../commons/services/MiembroService';
import { MiembroDto } from '../../commons/dto/MiembroDto';
import { TextareaModule } from 'primeng/textarea';
import { TareaService } from '../../commons/services/TareaService';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { Tarea } from '../../commons/dto/Tarea';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-edit-tarea-dialog',
  templateUrl: './edit-tarea-dialog.component.html',
  styleUrls: ['./edit-tarea-dialog.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    CalendarModule,
    TextareaModule,
    DatePickerModule
  ]
})
export class EditTareaDialogComponent implements OnInit {
  editForm: FormGroup;
  currentMember!: MiembroDto;
  loading = false;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private miembroService: MiembroService,
    private tareaService: TareaService,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService
  ) {
    this.editForm = new FormGroup({
      titulo: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [Validators.required]),
      fechaInicio: new FormControl(null, [Validators.required]),
      fechaFin: new FormControl(null, [Validators.required])
    });
  }

  ngOnInit() {
    this.loadCurrentMember();
    this.initForm();
  }

  private loadCurrentMember(): void {
    this.miembroService.getMiembroActual().subscribe({
      next: (miembro: MiembroDto | null) => {
        if (miembro) {
          this.currentMember = miembro;
          this.cdr.markForCheck();
        }
      },
      error: (err) => {
        console.error('Error al cargar miembro:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar la información del miembro'
        });
      }
    });
  }

  private initForm(): void {
    const tarea = this.config.data.tarea;
    this.editForm.patchValue({
      titulo: tarea.titulo,
      descripcion: tarea.descripcion,
      fechaInicio: new Date(tarea.fechaInicio),
      fechaFin: new Date(tarea.fechaFin)
    });
  }

  guardarCambios() {
    if (this.editForm.valid && this.currentMember) {
        this.loading = true;
        
        const formData = this.editForm.value;
        const tareaDto: TareaDto = {
            titulo: formData.titulo,
            descripcion: formData.descripcion,
            fechaInicio: formData.fechaInicio,
            fechaFin: formData.fechaFin,
            estado: this.config.data.tarea.estado, // Mantener el estado actual
            proyecto: { idProyecto: this.config.data.idProyecto },
            asignadoA: { idMiembro: this.currentMember.idMiembro }
        };

        // Cambio clave aquí: 
        // En lugar de hacer el update, simplemente cerramos el diálogo con los datos
        this.ref.close(tareaDto);
        
        // Eliminamos completamente la llamada al servicio desde aquí
    }
}

  cancelar() {
    this.ref.close();
  }
}