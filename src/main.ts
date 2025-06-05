import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MiembroService } from './app/commons/services/MiembroService';
import { ProyectoService } from './app/commons/services/ProyectoService';
import { NgModule, LOCALE_ID, importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from './app/commons/services/AlertService';
import { provideAnimations } from '@angular/platform-browser/animations';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    MiembroService,
    ProyectoService,
    ConfirmationService,
    MessageService,
    importProvidersFrom(CommonModule),
    AlertService,
    provideAnimations()
  ]
})
.catch((err) => console.error(err));