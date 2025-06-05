import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ReplaySubject } from 'rxjs';

// Define el servicio para manejar alertas
@Injectable({
  providedIn: 'root'
})
export class AlertService {

/**
* Alerts Observer
*/
private mOnAlertAdded: ReplaySubject<any> = new ReplaySubject(1);

// Servicio MessageService para trabajar con Toasts
constructor(private messageService: MessageService) {}

/**
 * Adds an alert
 * @param severity severity level of the alert
 * @param summary summary of the alert
 * @param detail detailed message of the alert
 */
public addAlertData(severity: MESSAGE_SEVERITY, summary: string, detail: string) {
  const message = { severity, summary, detail };
    this.mOnAlertAdded.next(message);
    this.messageService.add(message);
  }

/**
* Gets the alerts observable
*/
public get OnAlertAdded() {
  return this.mOnAlertAdded;
  }
}

// Enum para los diferentes niveles de gravedad
export enum MESSAGE_SEVERITY {
  OK = 'success',
  INFO = 'info',
  ERROR = 'error',
  WARN = 'warn'
}
