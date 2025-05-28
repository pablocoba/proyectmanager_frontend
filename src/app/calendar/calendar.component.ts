import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DiaHoy } from '../commons/dto/DiaHoy';

@Component({
  selector: 'app-calendar',
  imports: [
    CommonModule,
    
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
  week: any= ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"]
  displayedDays: DiaHoy[] = []; //mostrará 7 días en desktop y 1 en móvil

  hoy: Date = new Date();
  
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


  generateWeekView(referenceDate: Date):void{
    this.displayedDays = [] //reiniciamos array

    const startOfWeek =  new Date(referenceDate);
    startOfWeek.setDate(referenceDate.getDate() - referenceDate.getDay()); //getDay devuelve 0 para domingo, 1 para lunes, etc
    startOfWeek.setHours(0,0,0,0); //igualar horas

    let firstMonth: number | undefined;
    let lastMonth: number | undefined;
    let firstYear: number | undefined;
    let lastYear: number | undefined;

    const monthNamesAbbr = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

    for(let i = 0; i > 7; i++){
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);

      const isToday = 
        currentDay.getFullYear() === this.hoy.getFullYear() &&
        currentDay.getMonth() === this.hoy.getMonth() &&
        currentDay.getDay() === this.hoy.getDay();

      const isCurrentMonth = currentDay.getMonth() === referenceDate.getMonth()


    }


  }

  ngOnInit(){
    console.log(this.hoy.toString().slice(0,3))
  }

}
