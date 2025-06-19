import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { filter, map, Observable, tap } from "rxjs";
import { Proyecto } from "../dto/Proyecto";
import { ProyectoDto } from "../dto/ProyectoDto";
import { CreateProyectoDto } from "../dto/CreateProyectoDto";
import { MiembroProyectoDto } from "../dto/MiembroProyectoDto";
import { MiembroService } from "./MiembroService";
import { MiembroDto } from "../dto/MiembroDto";

@Injectable({
    providedIn: 'root'
})

export class ProyectoService {
    private baseUrl : string = 'https://tfc-t00f.onrender.com';
    private proyectosUrl : string = '/proyectos';
    private proyectosUsuario: MiembroProyectoDto[] = [];

    constructor(private http: HttpClient, private miembroService : MiembroService){ }

    getProyectos(): Observable<ProyectoDto[]>{
        return this.http.get<ProyectoDto[]>(`${this.baseUrl}${this.proyectosUrl}`);
    }

    getProyectosById(id : number): Observable<ProyectoDto>{
        return this.http.get<ProyectoDto>(`${this.baseUrl}${this.proyectosUrl}/${id}`);
    }

    getProyectoCompletoById(id : number): Observable<Proyecto>{
        return this.http.get<Proyecto>(`${this.baseUrl}${this.proyectosUrl}/${id}`);
    }
    
    createProyecto(dto: CreateProyectoDto):Observable<any>{
        return this.http.post<any>(`${this.baseUrl}${this.proyectosUrl}`, dto);
    }

    updateProyecto(id:number, dto: CreateProyectoDto):Observable<any>{
        console.log("proyecto actualizandose:::::",dto)
        return this.http.put<any>(`${this.baseUrl}${this.proyectosUrl}/${id}`, dto)
    }

    getProyectosUsuario(): Observable<MiembroProyectoDto[]>{
        return this.miembroService.getMiembroActual().pipe(
            filter((miembro): miembro is MiembroDto => miembro !== null),
            map(miembro => miembro.proyectos),
            tap(proyectos => this.proyectosUsuario = proyectos)
        )
    }

    deleteProyecto(id:number): Observable<void>{
        return this.http.delete<any>(`${this.baseUrl}${this.proyectosUrl}/${id}`)
    }

}