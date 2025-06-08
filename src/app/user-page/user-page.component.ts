import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { ProjectManagerComponent } from '../project-manager/project-manager.component';
import { CalendarComponent } from '../calendar/calendar.component';

@Component({
  selector: 'app-user-page',
  imports: [
    HeaderComponent,
    ProjectManagerComponent,
    CalendarComponent
  ],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss'
})
export class UserPageComponent {
  
}
