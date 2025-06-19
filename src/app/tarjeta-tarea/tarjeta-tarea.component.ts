import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TareaService } from '../commons/services/TareaService';
import { Tarea } from '../commons/dto/Tarea';
import { TareaDto } from '../commons/dto/TareaDto';
import { EstadoTarea } from '../commons/dto/EstadoTarea';
import { TareaTitleTruncatePipe, TareaTruncatePipe } from '../commons/pipes/desc-truncate.pipe';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EditTareaDialogComponent } from './edit-tarea-dialog/edit-tarea-dialog.component';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-tarjeta-tarea',
  templateUrl: './tarjeta-tarea.component.html',
  styleUrls: ['./tarjeta-tarea.component.scss'],
  imports:[
    ReactiveFormsModule,
    TareaTruncatePipe,
    TareaTitleTruncatePipe,
    CheckboxModule,
    ButtonModule,
    MenuModule
  ]
})
export class TarjetaTareaComponent implements OnInit {
  @Input() tareaData !: Tarea;
  @Input() index : any;
  @Input() tamano : boolean | null = null;
  @Output() tareaEliminada = new EventEmitter<void>();
  tarjetaTareaForm: FormGroup;
  ref: DynamicDialogRef | undefined;
  menuItems: MenuItem[] = [];
  menuVisible = false;

  constructor(
    private tareaService: TareaService,
    private dialogService: DialogService
  ) {
    this.tarjetaTareaForm = new FormGroup({
      check: new FormControl(false)
    });
  }

  ngOnInit() {
    const isCompleted = this.tareaData.estado === EstadoTarea.COMPLETADA;
    this.tarjetaTareaForm.get('check')?.setValue(isCompleted);

    this.tarjetaTareaForm.get('check')?.valueChanges.subscribe((isChecked) => {
      this.updateTareaStatus(isChecked);
    });

    this.menuItems = [
      {
        label: 'Opciones',
        items: [
          {
            label: 'Editar',
            icon: 'pi pi-pencil',
            command: () => this.openEditDialog()
          },
          {
            label: 'Eliminar',
            icon: 'pi pi-trash',
            command: () => this.deleteTarea()
          }
        ]
      }
    ];
  }

  openEditDialog() {
    const isMobile = window.innerWidth < 768;

    this.ref = this.dialogService.open(EditTareaDialogComponent, {
        header: 'Editar Tarea',
        width: isMobile ? '90%' : '50%',
        data: {
            tarea: this.tareaData,
            idProyecto: this.tareaData.idProyecto
        },
        contentStyle: { 'max-height': '90vh', overflow: 'auto' }
    });

    this.ref.onClose.subscribe((tareaActualizada: TareaDto) => {
        if (tareaActualizada) {
            this.tareaData = {
                ...this.tareaData,
                titulo: tareaActualizada.titulo,
                descripcion: tareaActualizada.descripcion,
                fechaInicio: tareaActualizada.fechaInicio,
                fechaFin: tareaActualizada.fechaFin
            };
            
            const isCompleted = this.tareaData.estado === EstadoTarea.COMPLETADA;
            this.tarjetaTareaForm.get('check')?.setValue(isCompleted, { emitEvent: false });
        }
    });
}

  deleteTarea() {
    if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
        this.tareaService.deleteTarea(this.tareaData.idTarea).subscribe({
            next: () => {
                this.tareaEliminada.emit(); // Notificar al padre
            },
            error: (err) => {
                console.error('Error al eliminar la tarea:', err);
                alert('No se pudo eliminar la tarea');
            }
        });
    }
}

  updateTareaStatus(isCompleted: boolean): void {
    const newEstado = isCompleted ? EstadoTarea.COMPLETADA : EstadoTarea.PENDIENTE;
    
    const tareaDto: TareaDto = {
      titulo: this.tareaData.titulo,
      descripcion: this.tareaData.descripcion,
      fechaInicio: this.tareaData.fechaInicio,
      fechaFin: this.tareaData.fechaFin,
      estado: newEstado,
      proyecto: { idProyecto: this.tareaData.idProyecto },
      asignadoA: { idMiembro: this.tareaData.idMiembro }
    };

    this.tareaService.updateTarea(this.tareaData.idTarea, tareaDto).subscribe({
      next: (tareaActualizada) => {
        this.tareaData = tareaActualizada;
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
        this.tarjetaTareaForm.get('check')?.setValue(!isCompleted, { emitEvent: false });
      }
    });
  }
}