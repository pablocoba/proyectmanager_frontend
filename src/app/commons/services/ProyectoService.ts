import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Proyecto } from "../dto/Proyecto";
import { ProyectoDto } from "../dto/ProyectoDto";
import { CreateProyectoDto } from "../dto/CreateProyectoDto";

@Injectable({
    providedIn: 'root'
})

export class ProyectoService {
    private baseUrl : string = 'https://tfc-t00f.onrender.com';
    private proyectosUrl : string = '/proyectos';

    constructor(private http: HttpClient){ }

    getProyectos(): Observable<ProyectoDto[]>{
        return this.http.get<ProyectoDto[]>(`${this.baseUrl}${this.proyectosUrl}`);
    }

    getProyectosById(id : number): Observable<ProyectoDto>{
        return this.http.get<ProyectoDto>(`${this.baseUrl}${this.proyectosUrl}/${id}`);
    }
    createProyecto(dto: CreateProyectoDto):Observable<any>{
        return this.http.post<any>(`${this.baseUrl}${this.proyectosUrl}`, dto);
    }

}