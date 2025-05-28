import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Proyecto } from "../dto/Proyecto";

@Injectable({
    providedIn: 'root'
})

export class ProyectoService {
    private baseUrl : string = 'http://localhost:8080';
    private proyectosUrl : string = '/proyectos';

    constructor(private http: HttpClient){ }

    getProyectos(): Observable<Proyecto[]>{
        return this.http.get<Proyecto[]>(`${this.baseUrl}${this.proyectosUrl}`);
    }
    getProyectosById(id : number): Observable<Proyecto[]>{
        return this.http.get<Proyecto[]>(`${this.baseUrl}${this.proyectosUrl}/${id}`);
    }

}