import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { AlertService } from '../commons/services/AlertService';
import { CreateTareaDialogComponent } from './create-tarea-dialog/create-tarea-dialog.component';
@Component({
  selector: 'app-header',
  imports: [
    ButtonModule,
    MenuModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  providers: [
    DialogService,
    AlertService,
    MessageService,
    CreateTareaDialogComponent
  ],
})

export class HeaderComponent implements OnInit {

  items: MenuItem[] = [
    {
      label: 'Nueva Tarea',
      icon: 'pi pi-plus',
      command: () => this.showCreateTareaDialog()  // Función al hacer clic
    },
    {
      label: 'Nuevo Proyecto',
      icon: 'pi pi-plus', //TODO cambiar el icono
      // command: () => this.importarExcel()
    },
    // {
    //   label: 'Configuración',
    //   icon: 'pi pi-cog',
    //   items: [  // Submenú anidado
    //     { label: 'Preferencias', icon: 'pi pi-sliders-h' },
    //     { label: 'Plantillas', icon: 'pi pi-file' }
    //   ]
    // }
  ];

  ref: DynamicDialogRef | undefined;
  private dialogSubscription: Subscription | undefined; // Para gestionar la suscripción

  constructor(private dialogService: DialogService) {

  }

  ngOnInit() {

  }

  showCreateTareaDialog() {

    const isMobile = window.innerWidth < 768;

    this.ref = this.dialogService.open(CreateTareaDialogComponent, {
      header: "Nueva tarea",
      width: isMobile ? '82%' : '30%', //hace que sea más grande o peque en móvil o desktop
      height: 'auto',
      modal: true,
      closable: true,
      contentStyle: {
        'max-height': '80vh',
        overflow: 'auto',
        'padding': '0'
      },
      baseZIndex: 10000
    });

    this.dialogSubscription = this.ref.onClose.subscribe()
  }
}
