import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Evento } from '../dto/Evento';
import { EventoDto } from '../dto/EventoDto';

@Injectable({
    providedIn: 'root'
})

export class EventoService {
    private baseUrl : string = 'https://tfc-t00f.onrender.com';
    private eventosUrl : string = '/eventos';

    constructor(private http: HttpClient){ }

    getEventos(): Observable<Evento[]>{
        return this.http.get<Evento[]>(`${this.baseUrl}${this.eventosUrl}`);
    }

    createEvento(dto: EventoDto): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}${this.eventosUrl}`, dto);
    }


    updateEvento(id:number, dto:EventoDto): Observable<any>{
        return this.http.put<any>(`${this.baseUrl}${this.eventosUrl}/${id}`, dto)
    }

    deleteEvento(id:number):Observable<any>{
        return this.http.delete<any>(`${this.baseUrl}${this.eventosUrl}/${id}`)
    }
}