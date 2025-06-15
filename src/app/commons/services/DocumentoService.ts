import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Evento } from "../dto/Evento";
import { Proyecto } from "../dto/Proyecto";
import { Documento } from "../dto/Documento";
import { CreateDocumentoDto } from "../dto/CreateDocumentoDto";

@Injectable({
    providedIn: 'root'
})

export class DocumentoService {
    private baseUrl : string = 'https://tfc-t00f.onrender.com';
    private docsUrl : string = '/documentos';
    private eventosByProyectIdUrl : string = '/eventos/proyecto/';
    constructor(private http: HttpClient){ }

    getDocumentos(): Observable<Documento[]>{
        return this.http.get<Documento[]>(`${this.baseUrl}${this.docsUrl}`);
    }

    getDocumentosByProyecto(idProyecto: number): Observable<Documento[]> {
        return this.http.get<Documento[]>(`${this.baseUrl}${this.docsUrl}/proyecto/${idProyecto}`);
    }

    uploadDocumento(dto : CreateDocumentoDto): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}${this.docsUrl}`, dto
        );
    }

    deleteDocumento(idDocumento: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}${this.docsUrl}/${idDocumento}`);
    }

    downloadDocumento(idDocumento: number): Observable<Blob> {
        return this.http.get(`${this.baseUrl}${this.docsUrl}/${idDocumento}`, {
        responseType: 'blob'
        });
    }

    // createEvento(dto: EventoDto): Observable<any> {
    //     return this.http.post<any>(`${this.baseUrl}${this.eventosUrl}`, dto);
    // }
    // getEventosByProyecto(id : number): Observable<Evento[]>{
    //     return this.http.get<Evento[]>(`${this.baseUrl}${this.eventosByProyectIdUrl}${id}`)
    // }
    // updateEvento(id:number, dto:EventoDto): Observable<any>{
    //     return this.http.put<any>(`${this.baseUrl}${this.eventosUrl}/${id}`, dto)
    // }
    // deleteEvento(id:number):Observable<any>{
    //     return this.http.delete<any>(`${this.baseUrl}${this.eventosUrl}/${id}`)
    // }
}