import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-add-event',
  imports: [
    ButtonModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    FloatLabelModule
  ],
  templateUrl: './add-event.component.html',
  styleUrl: './add-event.component.scss'
})
export class AddEventComponent {
  @Output() closeDialog = new EventEmitter<void>();
  hasEvent: boolean = false;
  data !: any[];
  currentDateSelected !: Date;

  addEventForm: FormGroup = new FormGroup({
    eventName: new FormControl(null, [Validators.required]),
    eventDescription: new FormControl(null),
    eventDate: new FormControl(null, [Validators.required]),
  })


  constructor(@Inject(DynamicDialogConfig) private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,){
      
    }

  ngOnInit(){
    this.currentDateSelected = this.config.data;

    let newDate = new Date(this.currentDateSelected);
    newDate.setMinutes(newDate.getMinutes() + 1); // Suma 1 minuto a la copia
    this.currentDateSelected = newDate;
    console.log(this.currentDateSelected)
  }

  onCancel(){
    this.closeDialog.emit();
    this.ref.close();
  }
  onEventAdded(){
    this.hasEvent = true;
    let descripcion = this.addEventForm.get('eventDescription')?.value ? null : '...'
    this.data = [
      this.hasEvent,
      this.addEventForm.get('eventName')?.value,
      descripcion,
      this.currentDateSelected
    ]
    this.ref.close(this.data);
  }

}
