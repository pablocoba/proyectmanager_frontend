import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MiembroService } from './app/commons/services/MiembroService';
import { ProyectoService } from './app/commons/services/ProyectoService';
import { NgModule, LOCALE_ID, importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    MiembroService,
    ProyectoService,
    ConfirmationService,
    MessageService,
    importProvidersFrom(CommonModule)
  ]
})
.catch((err) => console.error(err));