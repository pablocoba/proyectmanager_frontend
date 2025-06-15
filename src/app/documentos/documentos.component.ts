  import { CommonModule } from '@angular/common';
  import { Component, OnInit, ViewChild } from '@angular/core';
  import { ButtonModule } from 'primeng/button';
  import { FileSelectEvent, FileUpload, FileUploadModule } from 'primeng/fileupload';
  import { HeaderComponent } from '../header/header.component';
  import { ToastModule } from 'primeng/toast';
  import { ProgressBarModule } from 'primeng/progressbar';
  import { BadgeModule } from 'primeng/badge';
  import { OverlayBadgeModule } from 'primeng/overlaybadge';
  import { ProgressSpinnerModule } from 'primeng/progressspinner';
  import { MessageService } from 'primeng/api';
  import { HttpClient, HttpHeaders } from '@angular/common/http';
  import { Documento } from '../commons/dto/Documento';
  import { DocumentoService } from '../commons/services/DocumentoService';
  import { CurrentProyectoService } from '../commons/services/CurrentProyectoService';
  import { TableModule } from 'primeng/table';
import { CreateDocumentoDto } from '../commons/dto/CreateDocumentoDto';

  @Component({
    selector: 'app-documentos',
    imports: [
      CommonModule,
      FileUploadModule,
      ButtonModule,
      HeaderComponent,
      ToastModule,  
      ProgressBarModule,
      BadgeModule,
      OverlayBadgeModule,
      ProgressSpinnerModule,
      TableModule
    ],
    templateUrl: './documentos.component.html',
    providers:
    [
      MessageService
    ],
    styleUrl: './documentos.component.scss'
  })
  export class DocumentosComponent implements OnInit{
    
    @ViewChild('fu') fileUpload!: FileUpload;
    selectedFile: File | null = null;
    uploadInProgress = false;
    documentos: any[] = [];
    documentosFiltrados: any[] = [];
    currentProyectoId: number | null = null;
    loading = false;

    constructor(
      private http: HttpClient,
      private messageService: MessageService,
      private documentoService : DocumentoService,
      private currentProyecto : CurrentProyectoService
    ){

    }

    ngOnInit(): void {
      this.currentProyecto.proyectoActual$.subscribe(id => {
        this.currentProyectoId = id;
        this.cargarDocumentos();
      });
    }

    // Método para obtener el tipo de archivo
getFileType(filename: string): string {
  return filename.split('.').pop()?.toUpperCase() || 'FILE';
}

// Método para descargar documentos
descargarDocumento(documento: Documento): void {
  this.documentoService.downloadDocumento(documento.idDocumento).subscribe({
    next: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = documento.nombreArchivo;
      a.click();
      window.URL.revokeObjectURL(url);
    },
    error: (err) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al descargar documento'
      });
    }
  });
}

  // Método para eliminar documentos
  eliminarDocumento(idDocumento: number): void {
    if (confirm('¿Estás seguro de eliminar este documento?')) {
      this.documentoService.deleteDocumento(idDocumento).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Documento eliminado correctamente'
          });
          this.cargarDocumentos(); // Recargar la lista
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al eliminar documento'
          });
        }
      });
    }
  }

    cargarDocumentos(): void {
      if (!this.currentProyectoId) {
        this.documentosFiltrados = [];
        return;
      }

      this.loading = true;
      
      this.documentoService.getDocumentosByProyecto(this.currentProyectoId)
        .subscribe({
          next: (documentos) => {
            this.documentosFiltrados = documentos;
            this.loading = false;
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al cargar documentos'
            });
            this.loading = false;
          }
        });
    }

    filtrarDocumentosPorProyecto(): void {
      if (this.currentProyectoId) {
        this.documentosFiltrados = this.documentos.filter(
          doc => doc.idProyecto === this.currentProyectoId
        );
      } else {
        this.documentosFiltrados = [];
      }
    }
    onFileSelect(event: { files: File[] }): void {
      if (event.files.length > 0) {
        this.selectedFile = event.files[0];
      }
    }

    uploadFile(): void {
      if (!this.selectedFile || !this.currentProyectoId) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Advertencia',
          detail: 'Debes seleccionar un archivo y tener un proyecto activo',
          life: 3000
        });
        return;
      }

    this.uploadInProgress = true;

    // Crear el DTO con la estructura requerida
    const documentoDto: CreateDocumentoDto = {
      nombreArchivo: this.selectedFile.name,
      rutaArchivo: `/documentos/${Date.now()}_${this.selectedFile.name}`, // Nombre único
      proyecto: {
        idProyecto: this.currentProyectoId
      }
    };

  this.documentoService.uploadDocumento(documentoDto)
    .subscribe({
      next: (response) => {
        console.log('Respuesta completa:', response); // Para debug
        
        // Versión más segura del mapeo
        const nuevoDocumento = {
          idDocumento: response.idDocumento || Date.now(),
          nombreArchivo: response.nombreArchivo || documentoDto.nombreArchivo,
          rutaArchivo: response.rutaArchivo || documentoDto.rutaArchivo,
          idProyecto: response.proyecto?.idProyecto || 
                     response.idProyecto || // Alternativa si viene en root
                     this.currentProyectoId // Valor por defecto
        };

        this.documentos.push(nuevoDocumento);
        this.filtrarDocumentosPorProyecto();
        
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Documento subido correctamente',
          life: 3000
        });
        
        this.resetUpload();
      },
      error: (err) => {
        console.error('Error al subir:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al subir documento: ' + (err.error?.message || err.message),
          life: 5000
        });
        this.uploadInProgress = false;
      },
      complete: () => {
        this.uploadInProgress = false;
      }
    });
}

    resetUpload(): void {
      this.selectedFile = null;
      this.fileUpload.clear(); // Limpia el componente FileUpload
      this.uploadInProgress = false;
    }


  }
