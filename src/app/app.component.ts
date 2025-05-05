import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { ProjectManagerComponent } from "./project-manager/project-manager.component";

@Component({
  selector: 'app-root',
  imports: [
    HeaderComponent,
    ProjectManagerComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'proyectmanager';
}
