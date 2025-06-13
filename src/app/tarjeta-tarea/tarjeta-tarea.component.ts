
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Button, ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProyectoService } from '../commons/services/ProyectoService';
import { Proyecto } from '../commons/dto/Proyecto';
import { Tarea } from '../commons/dto/Tarea';
import { TareaService } from '../commons/services/TareaService';
import { TareaTitleTruncatePipe, TareaTruncatePipe } from '../commons/pipes/desc-truncate.pipe';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AlertService } from '../commons/services/AlertService';
import { MessageService } from 'primeng/api';
import { CreateTareaDialogComponent } from '../header/create-tarea-dialog/create-tarea-dialog.component';
import { Subscription } from 'rxjs';
import { CheckboxModule } from 'primeng/checkbox';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-tarjeta-tarea',
  imports: [
    CardModule,
    ButtonModule,
    ProgressBarModule,
    TareaTruncatePipe,
    ButtonModule,
    CheckboxModule,
    ReactiveFormsModule,
    TareaTitleTruncatePipe
  
  ],
  templateUrl: './tarjeta-tarea.component.html',
  styleUrl: './tarjeta-tarea.component.scss',
  providers: [
      DialogService,
      AlertService,
      MessageService
    ],
})

export class TarjetaTareaComponent implements OnInit{

  tareas : Tarea[] = [];
  @Input() tareaData !: Tarea;
  @Input() index : any;

  tarjetaTareaForm: FormGroup = new FormGroup({
    check: new FormControl(null, [Validators.required]),
  })
  constructor (
  private tareaService : TareaService,
  ) {
    this.tareaService.getTareas().subscribe(tareas=>{
      this.tareas = tareas;
    })
  }
  
  ngOnInit() {
  }

}
