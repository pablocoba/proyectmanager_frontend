import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, HostListener, Inject, Input, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { ChatService } from '../commons/services/ChatService';
import { Mensaje } from '../commons/dto/Mensaje';
import { ProyectoDto } from '../commons/dto/ProyectoDto';
import { ProyectoService } from '../commons/services/ProyectoService';
import { UserToken } from '../commons/dto/UserToken';
import { formatDate } from '../commons/functions/formatDate';
import { Miembro } from '../commons/dto/Miembro';
import { TextareaModule } from 'primeng/textarea';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MensajeDto } from '../commons/dto/MensajeDto';
import { MiembroService } from '../commons/services/MiembroService';
import { Proyecto } from '../commons/dto/Proyecto';
import { CreateMsgMiembroDto } from '../commons/dto/CreateMsgMiembroDto';
import { CreateMsgProyectoDto } from '../commons/dto/CreateMsgProyectoDto';
import { CurrentProyectoService } from '../commons/services/CurrentProyectoService';

@Component({
  selector: 'app-chat',
  imports: [
    CommonModule,
    DatePipe,
    TextareaModule,
    ReactiveFormsModule,
    ButtonModule
  ],

  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit{
  
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  private shouldScrollToBottom = true;
  
  mensajes : Mensaje[] = [];
  currentProject !: ProyectoDto;
  user !: UserToken;
  proyectos : ProyectoDto[] = [];
  chatForm : FormGroup = new FormGroup({
    mensaje: new FormControl(null),
  })

  // miembroMensaje !:Miembro;
  nuevoMensaje !: MensajeDto;

  miembroMensaje : CreateMsgMiembroDto ={
    idMiembro: 0
  };
  
  @Input() proyectoActual: number | null = null;

  constructor(
    private chatService : ChatService,
    private proyectoService : ProyectoService,
    private miembroService : MiembroService,
    private currentProyecto : CurrentProyectoService,
    @Inject(PLATFORM_ID) private platformId:Object
  ){
    if(isPlatformBrowser(this.platformId)){
      this.user = {
        username : localStorage.getItem('username')!,
        token: localStorage.getItem('authToken')!
      }
    }

    this.currentProyecto.proyectoActual$.subscribe(idProyecto => {

      console.log('ID Proyecto recibido:', idProyecto);
      
      // 3. Si hay un proyecto seleccionado
      if (idProyecto !== null) {
        this.proyectoService.getProyectosById(idProyecto).subscribe({
          next: (proyecto) => {
            this.currentProject = proyecto;
            this.chatService.getMensajes(this.currentProject.idProyecto).subscribe({
        next: (mensajes: Mensaje[]) => {
          this.mensajes = mensajes;
          console.log("Mensajes recibidos:", this.mensajes);
          
          this.miembroService.getMiembros().subscribe({
            next: (miembros: Miembro[]) => {
              const miembroFiltrado = miembros.find(miembro => 
                this.user.username === miembro.nombreUsuario
              );

              if (miembroFiltrado) {

                this.miembroMensaje = {
                  idMiembro: miembroFiltrado.idMiembro
                }
                // Aquí puedes usar miembroFiltrado para lo que necesites
              } else {
                console.warn("No se encontró el miembro con username:", this.user.username);
              }
            },
            error: (err) => {
              console.error("Error al obtener miembros:", err);
            }
          });
        },
        error: (err) => {
          console.error("Error al obtener mensajes:", err);
        }
      });
          },
          error: (err) => {
            console.error('Error al cargar proyecto:', err);

          }
        });
      } else {
        console.log('No hay proyecto seleccionado');
      }
      
    })

  }

  ngOnInit(){
    
  }

  isNewDay(currentIndex:number){
    if (currentIndex === 0) return true; // Siempre mostrar fecha en el primer mensaje

    const currentDate = new Date(this.mensajes[currentIndex].fechaHora);
    const previousDate = new Date(this.mensajes[currentIndex - 1].fechaHora);

    return (
      currentDate.getDate() !== previousDate.getDate() ||
      currentDate.getMonth() !== previousDate.getMonth() ||
      currentDate.getFullYear() !== previousDate.getFullYear()
    );
  }

  sendMessage(){
    const mensaje = this.chatForm.get('mensaje')?.value

    this.nuevoMensaje ={
      proyecto : this.currentProject,
      miembro : this.miembroMensaje,
      fechaHora : new Date(),
      contenido : mensaje
    }

    this.chatService.createMensaje(this.nuevoMensaje).subscribe({
    next: () => {
      // 2. Recarga los mensajes desde el servidor
      this.chatService.getMensajes(this.currentProject.idProyecto).subscribe({
        next: (mensajesActualizados) => {
          this.mensajes = mensajesActualizados;
          this.chatForm.get('mensaje')?.reset();
          this.scrollToBottom(0);
          console.log("Mensajes recargados:", this.mensajes);
        },
        error: (err) => console.error("Error al recargar mensajes:", err)
      });
    },
    error: (err) => console.error("Error al enviar mensaje:", err)
  });

    this.chatForm.get('mensaje')?.setValue('')

  }

  private scrollToBottom(timeout:number): void {
    if (!this.shouldScrollToBottom) return;
    
    try {
      setTimeout(() => {
        if (this.messagesContainer) {
          this.messagesContainer.nativeElement.scrollTop = 
            this.messagesContainer.nativeElement.scrollHeight;
        }
      }, timeout);
    } catch(err) { 
      console.error('Error en scroll:', err);
    }
  }
  
  ngAfterViewInit() {
    this.scrollToBottom(600);
  }

  @HostListener('scroll', ['$event'])
  onScroll(event: Event): void {
    const element = event.target as HTMLElement;
    const tolerance = 10;
    const atBottom = element.scrollHeight - (element.scrollTop + element.clientHeight) < tolerance;
    
    // Si el usuario no está al fondo, desactivamos scroll automático
    this.shouldScrollToBottom = atBottom;
  }
}
