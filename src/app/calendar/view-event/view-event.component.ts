import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { Evento } from '../../commons/dto/Evento';

@Component({
  selector: 'app-view-event',
  imports: [
    ButtonModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    FloatLabelModule
  ],
  templateUrl: './view-event.component.html',
  styleUrl: './view-event.component.scss'
})
export class ViewEventComponent {
@Output() closeDialog = new EventEmitter<void>();
event !: Evento;
  hasEvent: boolean = false;

  constructor(@Inject(DynamicDialogConfig) private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,){
      
    }

    ngOnInit(){
      this.event = this.config.data;
      console.log(this.event)
    }


}
