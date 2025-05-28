import { ApplicationModule, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { ProjectManagerComponent } from "./project-manager/project-manager.component";
import { CalendarComponent } from './calendar/calendar.component';

@Component({
  selector: 'app-root',
  imports: [
    HeaderComponent,
    ProjectManagerComponent,
    ApplicationModule,
    CalendarComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'proyectmanager';
}
