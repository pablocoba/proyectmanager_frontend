import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Proyecto } from "../dto/Proyecto";
import { ProyectoDto } from "../dto/ProyectoDto";
import { CreateProyectoDto } from "../dto/CreateProyectoDto";
import { MensajeDto } from "../dto/MensajeDto";
import { Mensaje } from "../dto/Mensaje";

@Injectable({
    providedIn: 'root'
})

export class ChatService {
    private baseUrl : string = 'https://tfc-t00f.onrender.com';
    private mensajesUrl : string = '/mensajes';
    private getMensajesUrl : string = '/mensajes/proyecto/';

    constructor(private http: HttpClient){ }

    getMensajes(proyecto: number): Observable<Mensaje[]>{
        return this.http.get<Mensaje[]>(`${this.baseUrl}${this.getMensajesUrl}${proyecto}`);
    }

    createMensaje(dto: MensajeDto):Observable<any>{
        return this.http.post<any>(`${this.baseUrl}${this.mensajesUrl}`, dto
        );
    }

}