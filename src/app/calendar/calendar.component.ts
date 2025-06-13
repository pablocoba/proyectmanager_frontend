import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AddEventComponent } from './add-event/add-event.component';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AlertService } from '../commons/services/AlertService';
import {  MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Evento } from '../commons/dto/Evento';
import { DescTruncatePipe, TitleTruncatePipe } from '../commons/pipes/desc-truncate.pipe';
import { ButtonModule } from 'primeng/button';
import { EventoService } from '../commons/services/EventoService';
import { EventoDto } from '../commons/dto/EventoDto';
import { ProyectoService } from '../commons/services/ProyectoService';
import { MiembroService } from '../commons/services/MiembroService';
import { formatDate } from '../commons/functions/formatDate';
import { ProyectoDto } from '../commons/dto/ProyectoDto';
import { CalendarDay } from '../commons/dto/CalendarDay';
import { ViewEventComponent } from './view-event/view-event.component';


@Component({
  selector: 'app-calendar',
  imports: [
    CommonModule,
    DynamicDialogModule,
    DescTruncatePipe,
    ButtonModule,
    TitleTruncatePipe
  ],
  changeDetection:ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  providers: [
    DialogService,
    AlertService,
    MessageService
  ],
})
export class CalendarComponent implements OnInit{

  ref: DynamicDialogRef | undefined;
  private dialogSubscription: Subscription | undefined; // Para gestionar la suscripción

  todayDate: Date = new Date();
  displayedDays: CalendarDay[]= [] //mostrará 5 días en desktop y 1 en móvil
  displayedEventDays: CalendarDay[] = []

  currentProject : ProyectoDto ={
    idProyecto: 1,
    nombre:"string",
    descripcion:"string" ,
    fechaInicio:formatDate(new Date()),
    fechaFin:formatDate(new Date()),
  }

  eventos : Evento[] = [];
  currentDateSelected: Date = new Date();
  currentMonthSelected : string = this.getMonthName(new Date());

  hasEvent: boolean = false;

  currentEvent !: Evento

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
  
  getMonthName(date: Date): string {
    if (!date) return ''; 
    const options: Intl.DateTimeFormatOptions = { month: 'long' };
    const fechaMes = new Intl.DateTimeFormat('es-ES', options).format(date);
    return fechaMes.charAt(0).toUpperCase() + fechaMes.slice(1);
    // 'es-ES' 
    // 'long' para el nombre completo (ej. "junio")
    // 'short' para la abreviatura (ej. "jun.")
    // 'narrow' para la más corta (ej. "J")
  }

  constructor(
    public dialogService : DialogService,
    private alertService : AlertService,
    private eventoService : EventoService,
    private proyectoService : ProyectoService,
    private miembroService : MiembroService,
    private cdr : ChangeDetectorRef
  ){
    
    this.proyectoService.getProyectosById(1).subscribe(proyecto=>{
      this.currentProject = proyecto;
    })
    

  }

  async ngOnInit(){
    this.currentDateSelected = new Date()
    await this.loadEventos()
    this.updateCalendarView();
  }

  //abre el diálogo de añadir evento y le pasa los datos.
  showAddEventDialog(dayData:Date) {
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
      data:dayData,
      baseZIndex: 10000
    });

    this.dialogSubscription = this.ref.onClose.subscribe(async event=>{
      if(event !== null && event !== undefined){
        let newEvent : EventoDto = {
          proyecto: this.currentProject,
          titulo: event[1],
          fecha: event[3],
          descripcion: event[2]
        }

        try{
          const createdEvento = await this.eventoService.createEvento(newEvent).toPromise();
          
          await this.loadEventos();
          this.hasEvent = true;
          this.checkTodayEvent();
          this.updateCalendarView();
          this.cdr.detectChanges();
        }
        catch(error){
        }
        
        

      }
      else{
        console.error('error al recibir la variable de evento.')
      }
    })
  }

  //abre el diálogo de enseñar el evento y le pasa los datos para mostrarlo
  showEventDialog(CalendarDay : CalendarDay) {

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
      data:{CalendarDay: CalendarDay, project: this.currentProject},
      baseZIndex: 10000
    });

    this.dialogSubscription = this.ref.onClose.subscribe(async event => { // <-- Mantén 'async' aquí
    try {
      // Si loadEventos ya devuelve una Promise, SOLO usa await directamente:
      await this.eventoService.deleteEvento(event).toPromise();

      await this.loadEventos(); 
      this.hasEvent = false; 
      this.updateCalendarView();

    } catch (error) {
      console.error("Error al cargar eventos tras cerrar diálogo:", error);
    }
  });

  }


  next(): void {
  this.currentDateSelected.setDate(this.currentDateSelected.getDate() + 1);
  this.updateCalendarView(); // <--- LLAMADA A LA FUNCIÓN CENTRAL
}

previous(): void {
  this.currentDateSelected.setDate(this.currentDateSelected.getDate() - 1);
  this.updateCalendarView(); // <--- LLAMADA A LA FUNCIÓN CENTRAL
}

nextBig(): void {
    this.currentDateSelected.setDate(this.currentDateSelected.getDate() + 1); // O +N si quieres saltos grandes
    this.updateCalendarView();
}
previousBig(): void {
    this.currentDateSelected.setDate(this.currentDateSelected.getDate() - 1); // O -N si quieres saltos grandes
    this.updateCalendarView();
}

  //checkea si la fecha de hoy coincide con la fecha de algún evento.
  //TODO hay que hacer que recoja el array de los eventos de la base de datos y recorra las fechas para esto.
  checkTodayEvent(){

    for(let evento of this.eventos){

      let fechaEvento = evento.fecha;
      let fecha = new Date(evento.fecha)

        if(this.isSameDay(fecha, this.currentDateSelected)){

          this.currentEvent = evento
          this.hasEvent = true;
        return
        }
        else{
          this.hasEvent = false;
        }
      
    }

  }

  //TODO MAÑANA
  checkDateEvents(){
    
    for(let dia of this.displayedDays){
      
      for(let evento of this.eventos){

        

      }
  
    }

  }



  private generateDisplayedDays(centerDate: Date): CalendarDay[] {
    const days: CalendarDay[] = [];
    const numDaysToShow = 5; // Siempre 5 días
    const tempDate = new Date(centerDate); // Crear una copia para manipular

    // Calcular el día de inicio para mostrar 5 días con centerDate como el 2º día (index 1)
    tempDate.setDate(centerDate.getDate() - 1); // <--- Ajusta el día de inicio

    for (let i = 0; i < numDaysToShow; i++) {
        const currentDayDate = new Date(tempDate);
        currentDayDate.setDate(tempDate.getDate() + i); // Asegura que se mueve correctamente

        // Mapear el evento para el día actual (lógica de mapEventsToDisplayedDays integrada aquí)
        let foundEvent: Evento | null = null;
        for (let evento of this.eventos) {
            const eventDate = new Date(evento.fecha);
            if (this.isSameDay(currentDayDate, eventDate)) {
                foundEvent = evento;
                break;
            }
        }
        days.push({ fecha: currentDayDate, event: foundEvent });
    }
    return days;
}

private updateCalendarView(): void {
    this.displayedDays = this.generateDisplayedDays(this.currentDateSelected); // Regenera los días
    this.currentMonthSelected = this.getMonthName(this.currentDateSelected); // Actualiza el nombre del mes
    this.checkTodayEvent(); // Revisa eventos para el día central
    this.cdr.detectChanges(); // <--- FORZAR DETECCIÓN DE CAMBIOS por OnPush
}

  async loadEventos() {
    try {
      const eventos = await this.eventoService.getEventos().toPromise();
      this.eventos = eventos || []; // Si es undefined, usa array vacío

    } catch (error) {
      console.error('Error:', error);
      this.eventos = []; // También en caso de error
    }
  }

  updateCurrentDayEventState(): void {
  let eventFoundForCurrentDay: Evento | null = null;

  // Itera sobre todos tus eventos cargados
  for (let evento of this.eventos) {
    // Compara la fecha del evento con la fecha del día actualmente seleccionado
    if (this.isSameDay(new Date(evento.fecha), this.currentDateSelected)) {
      eventFoundForCurrentDay = evento;
      break; // Si encuentras el evento, puedes salir del bucle
      }
    }
      // Actualiza las propiedades que controlan la vista
    if (eventFoundForCurrentDay) {
      this.hasEvent = true;
      this.currentEvent = eventFoundForCurrentDay;
    } else {
      this.hasEvent = false;
    }

  }

  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
          date1.getMonth() === date2.getMonth() &&
          date1.getDate() === date2.getDate();
  }

  mapEventsToDisplayedDays(): void {
  const newDisplayedDays: CalendarDay[] = []; // <--- Crea un nuevo array
  const currentDaysToMap = [...this.displayedDays]; // <--- Haz una copia del array actual si necesitas iterar sobre él antes de modificarlo

  // Itera sobre cada una de las fechas puras que deben ser mostradas
  for (let day of currentDaysToMap) { // <--- Itera sobre la copia
    let foundEvent: Evento | null = null;

    for (let evento of this.eventos) {
      const eventDate = new Date(evento.fecha);
      if (this.isSameDay(day.fecha, eventDate)) {
        foundEvent = evento;
        break;
      }
    }

    // Añade el objeto DayWithEvent a tu nuevo array
    newDisplayedDays.push({
      fecha: day.fecha,
      event: foundEvent
    });
  }

  this.displayedDays = newDisplayedDays; // <--- Asigna el nuevo array una vez
  // No necesitas displayedEventDays como propiedad si solo es para esta lógica
}

}
