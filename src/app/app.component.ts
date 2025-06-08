import { ApplicationModule, Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { ProjectManagerComponent } from "./project-manager/project-manager.component";
import { CalendarComponent } from './calendar/calendar.component';

@Component({
  standalone:true,
  selector: 'app-root',
  imports: [
    ProjectManagerComponent,
    HeaderComponent,
    CalendarComponent

],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'proyectmanager';
}
