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
    eventDescription: new FormControl(null, [Validators.required]),
    eventDate: new FormControl(null, [Validators.required]),
  })


  constructor(@Inject(DynamicDialogConfig) private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,){
      
    }

  ngOnInit(){
    this.currentDateSelected = this.config.data;
  }
  onCancel(){
    this.closeDialog.emit();
    this.ref.close();
  }
  onEventAdded(){
    this.hasEvent = true;
    this.data = [
      this.hasEvent,
      this.addEventForm.get('eventName')?.value,
      this.addEventForm.get('eventDescription')?.value,
      this.currentDateSelected
    ]
    this.ref.close(this.data);
  }

}
