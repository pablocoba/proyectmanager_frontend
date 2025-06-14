import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { Tarea } from '../dto/Tarea';
import { TareaDto } from '../dto/TareaDto';

@Injectable({
    providedIn: 'root'
})

export class TareaService {
    private baseUrl : string = 'https://tfc-t00f.onrender.com';
    private tareasUrl : string = '/tareas';

    constructor(private http: HttpClient){ }

    getTareas(): Observable<Tarea[]>{
        return this.http.get<Tarea[]>(`${this.baseUrl}${this.tareasUrl}`);
    }

    createTarea(dto: TareaDto): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}${this.tareasUrl}`, dto);
    }

    getTareasByProyectoActivo(idProyectoActivo: number): Observable<Tarea[]> {
        return this.getTareas().pipe(
            map(tareas => tareas.filter(tarea => tarea.idProyecto === idProyectoActivo))
        );
    }

    // updateEvento(id:number, dto:EventoDto): Observable<any>{
    //     return this.http.put<any>(`${this.baseUrl}${this.eventosUrl}/${id}`, dto)
    // }

    // deleteEvento(id:number):Observable<any>{
    //     return this.http.delete<any>(`${this.baseUrl}${this.eventosUrl}/${id}`)
    // }
}