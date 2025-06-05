import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DiaHoy } from '../commons/dto/DiaHoy';
import { AddEventComponent } from './add-event/add-event.component';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AlertService } from '../commons/services/AlertService';
import { Footer, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Evento } from '../commons/dto/Evento';
import { DescTruncatePipe } from '../commons/pipes/desc-truncate.pipe';
import { ViewEventComponent } from './view-event/view-event.component';
import { ButtonModule } from 'primeng/button';
import { Miembros } from '../commons/dto/Miembros';
import { MiembroService } from '../commons/services/MiembroService';
@Component({
  selector: 'app-calendar',
  imports: [
    CommonModule,
    DynamicDialogModule,
    DescTruncatePipe,
    ButtonModule,
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  providers: [
    DialogService,
    AlertService,
    MessageService
  ],
})
export class CalendarComponent {

  ref: DynamicDialogRef | undefined;
  private dialogSubscription: Subscription | undefined; // Para gestionar la suscripción

  week: any= ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"]
  todayDate: Date = new Date();
  manana : Date = new Date(this.todayDate);
  displayedDays: Date[] = [
  ]; //mostrará 5 días en desktop y 1 en móvil
  miembros : Miembros[] = [];
  currentDateSelected: Date = new Date();
  hasEvent: boolean = false;
  dummyEvent : Evento={
    idEvento: 0,
    idProyecto: 0,
    titulo: "Evento",
    fecha: new Date,
    descripcion: "esto es un Evento que la verdad que es la puta polla porque me flipa y estoy encantado de tener este proyecto la verdad"
  }

  currentEvent : Evento = this.dummyEvent;


  eventos: Evento[] =[
    this.dummyEvent,
  ]

  //Devuelve el nombre completo del día de hoy en Español.
  weekDayName(hoy: Date){
    const hoyString = hoy.toString().slice(0,3);

    switch(hoyString){
      case "Mon":
        return "Lunes" ;
      case "Tue":
        return "Martes" ;
      case "Wed":
        return "Miércoles" ;
      case "Thu":
        return "Jueves" ;
      case "Fri":
        return "Viernes" ;
      case "Sat":
        return "Sábado" ;
      case "Sun":
        return "Domingo" ;
    }
    return "Lunes";
  }

 constructor(
  public dialogService : DialogService,
  private alertService : AlertService,
  private miembrosService : MiembroService
 ){
  this.miembrosService.getMiembros().subscribe(miembro=>{
    this.miembros = miembro;
    console.log(this.miembros)
  })
 }

  ngOnInit(){
    this.checkTodayEvent()
    this.displayedDays = this.generateCalendarDays()
  }

  showAddEventDialog() {
    const isMobile = window.innerWidth < 768;

    this.ref = this.dialogService.open(AddEventComponent, {
      header: "Añadir evento",
      width: isMobile ? '90%' : '30%', //hace que sea más grande o peque en móvil o desktop
      height: 'auto',
      modal: true,
      closable: true,
      contentStyle: { 
        'max-height': '80vh', 
        overflow: 'auto',
        'padding': '0'
      },
      data:this.currentDateSelected,
      baseZIndex: 10000
    });

    this.dialogSubscription = this.ref.onClose.subscribe(event=>{
      if(event !== null && event !== undefined){
        let newEvent : Evento = {
          idEvento:1,
          idProyecto: 1,
          titulo: event[1],
          descripcion: event[2],
          fecha: event[3]
        }
        this.eventos.push(newEvent);
        this.hasEvent = event[0];
        this.checkTodayEvent();

      }
      else{
        console.error('error al recibir la variable de evento.')
      }
    })
  }

  showEventDialog() {

    const isMobile = window.innerWidth < 768;

    this.ref = this.dialogService.open(ViewEventComponent, {
      width: isMobile ? '82%' : '30%', //hace que sea más grande o peque en móvil o desktop
      height: 'auto',
      modal: true,
      closable: true,
      contentStyle: { 
        'max-height': '80vh', 
        overflow: 'auto',
        'padding': '0'
      },
      data:this.dummyEvent,
      baseZIndex: 10000
    });

    
  }

  //pasa al día siguiente
  next(){
    const oldDate = this.currentDateSelected;
    let newFecha = new Date(oldDate);
    newFecha.setDate(oldDate.getDate() + 1);
    this.currentDateSelected = newFecha;
    this.checkTodayEvent();

    //cambia las fechas del calendario grande
    let newOldestDate : Date;
    newOldestDate = new Date(this.displayedDays[this.displayedDays.length-1])
    newOldestDate.setDate(newOldestDate.getDate()+1)
    this.displayedDays.shift();
    this.displayedDays.push(newOldestDate)
  }

  //pasa al día anterior
  previous(){
    const oldDate = this.currentDateSelected;
    let newFecha = new Date(oldDate);
    newFecha.setDate(oldDate.getDate() - 1);
    this.currentDateSelected = newFecha;
    this.checkTodayEvent()

    //cambia las fechas del calendario grande 1 dia hacia atrás
    let newNewestDate : Date;
    newNewestDate = new Date(this.displayedDays[0])
    newNewestDate.setDate(newNewestDate.getDate()-1)
    this.displayedDays.pop();
    this.displayedDays.unshift(newNewestDate)
  }

  //checkea si la fecha de hoy coincide con la fecha de algún evento.
  //TODO hay que hacer que recoja el array de los eventos de la base de datos y recorra las fechas para esto.
  checkTodayEvent(){

    console.log("eventos:", this.eventos)

    for(let evento of this.eventos){
      let fechaEvento = evento.fecha;
      for(let dia of this.displayedDays){
        if(dia.getDay() == this.currentDateSelected.getDay()){
          this.currentEvent = evento
        return
        }
        else{
          this.hasEvent = false;
        }
      }
    }

  }

  //TODO MAÑANA
  checkDateEvents(){
    
    for(let evento of this.eventos){
      let fechaEvento = evento.fecha;
      if(fechaEvento.getDay() == this.currentDateSelected.getDay()){
        this.hasEvent = true;
        this.currentEvent = evento
        console.log(this.currentEvent)
        return
      }
      else{
        this.hasEvent = false;
      }
    }
  }

  //metodo que genera 5 días para el calendario desktop en base al día de hoy
  //genera ayer, hoy y los 3 días siguientes
  generateCalendarDays(){
    let dates : Date[] = [];
    let yesterday = new Date(this.todayDate);
    yesterday.setDate(this.todayDate.getDate()-1)
    dates.push(yesterday)
    dates.push(this.todayDate)
    for(let i = 1; i < 4; i++){
      let newDate = new Date(this.todayDate);
      newDate.setDate(this.todayDate.getDate()+i)
      dates.push(newDate)
    }
    return dates;
  }

}
