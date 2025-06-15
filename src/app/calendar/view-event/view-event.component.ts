import { Component, EventEmitter, Inject, Input, Output, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogConfig, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Evento } from '../../commons/dto/Evento';
import { EventoService } from '../../commons/services/EventoService';
import { CalendarDay } from '../../commons/dto/CalendarDay';
import { CommonModule } from '@angular/common';
import { EventoDto } from '../../commons/dto/EventoDto';
import { Textarea, TextareaModule } from 'primeng/textarea';

  @Component({
    selector: 'app-view-event',
    imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DynamicDialogModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    FloatLabelModule,
    ConfirmDialogModule
    ],
    templateUrl: './view-event.component.html',
    styleUrl: './view-event.component.scss',
    encapsulation: ViewEncapsulation.None

  })
export class ViewEventComponent {

  @Output() closeDialog = new EventEmitter<void>();
  
  currentEvent: Evento | null = null; // Inicializa como null
  currentDayDate: Date | null = null;
  editMode : boolean = false;

  eventForm : FormGroup = new FormGroup({
    titulo: new FormControl(null),
    descripcion : new FormControl(null)
  })

  constructor(@Inject(DynamicDialogConfig) private config: DynamicDialogConfig,
    private ref: DynamicDialogRef, private  eventoService : EventoService){
      
    }

    ngOnInit(){

      this.currentEvent = this.config.data.CalendarDay.event
      this.currentDayDate = this.config.data.CalendarDay.fecha
      this.eventForm.get('titulo')?.setValue(this.currentEvent?.titulo);
      this.eventForm.get('descripcion')?.setValue(this.currentEvent?.descripcion);

    }
    
    saveChanges() {
      if (this.eventForm.valid && this.currentEvent) {
        const eventoDto: EventoDto = {
          titulo: this.eventForm.get('titulo')?.value,
          fecha: this.currentEvent.fecha,
          descripcion: this.eventForm.get('descripcion')?.value,
          proyecto: this.config.data.project
        };

        this.eventoService.updateEvento(this.currentEvent.idEvento, eventoDto).subscribe({
          next: (eventoActualizado) => {
            this.ref.close('updated'); // ⭐ Cierra con señal clara
          },
          error: (err) => console.error('Error al guardar:', err)
        });
      }
    }

    deleteEvent() {
      if (confirm('¿Estás seguro de eliminar este evento?')) {
        if (this.currentEvent) {
          this.eventoService.deleteEvento(this.currentEvent.idEvento).subscribe({
            next: () => {
              this.ref.close('deleted'); // Envía señal clara de eliminación
            },
            error: (err) => console.error('Error al eliminar:', err)
          });
        }
      }
    }
}
