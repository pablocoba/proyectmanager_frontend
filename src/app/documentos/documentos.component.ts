import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-documentos',
  imports: [
    CommonModule,
    FileUploadModule,
    ButtonModule,
    HeaderComponent
  ],
  templateUrl: './documentos.component.html',
  styleUrl: './documentos.component.scss'
})
export class DocumentosComponent {

}
