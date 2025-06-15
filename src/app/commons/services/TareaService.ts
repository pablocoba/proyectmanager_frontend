import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable, of, Subject } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { Tarea } from '../dto/Tarea';
import { TareaDto } from '../dto/TareaDto';
import { UpdateTareaDto } from '../dto/UpdateTareaDto';

@Injectable({
    providedIn: 'root'
})
export class TareaService {
    private baseUrl: string = 'https://tfc-t00f.onrender.com';
    private tareasUrl: string = '/tareas';

    // Subject para notificar actualizaciones
    private tareasUpdatedSource = new Subject<void>();

    // Observable público para suscripciones
    tareasUpdated$ = this.tareasUpdatedSource.asObservable();

    constructor(private http: HttpClient) { }

    getTareas(): Observable<Tarea[]> {
        return this.http.get<Tarea[]>(`${this.baseUrl}${this.tareasUrl}`);
    }

    createTarea(dto: TareaDto): Observable<Tarea> {
        return this.http.post<Tarea>(`${this.baseUrl}${this.tareasUrl}`, dto).pipe(
            tap(() => {
                // Notificar que se ha creado una nueva tarea
                this.tareasUpdatedSource.next();
            })
        );
    }

    updateTarea(id: number, dto: TareaDto): Observable<Tarea>{
        return this.http.put<Tarea>(`${this.baseUrl}${this.tareasUrl}/${id}`, dto)
    }

    getTareasByProyecto(idProyecto: number): Observable<Tarea[]> {
        return this.http.get<Tarea[]>(`${this.baseUrl}${this.tareasUrl}`).pipe(
            map(tareas => tareas.filter(t => t.idProyecto === idProyecto)),
            catchError(error => {
                console.error('Error al obtener tareas:', error);
                return of([]);
            })
        );
    }

    // Método alternativo si prefieres filtrar en el cliente
    getTareasByProyectoActivoClientSide(idProyectoActivo: number): Observable<Tarea[]> {
        return this.getTareas().pipe(
            map(tareas => tareas.filter(tarea => tarea.idProyecto === idProyectoActivo))
        );
    }

    deleteTarea(idTarea: number):Observable<void>{
        return this.http.delete<void>(`${this.baseUrl}${this.tareasUrl}/${idTarea}`)
    }

    // updateTarea(id: number, dto: TareaDto): Observable<Tarea> {
    //     return this.http.put<Tarea>(`${this.baseUrl}${this.tareasUrl}/${id}`, dto).pipe(
    //         tap(() => this.tareasUpdatedSource.next())
    //     );
    // }

    // deleteTarea(id: number): Observable<void> {
    //     return this.http.delete<void>(`${this.baseUrl}${this.tareasUrl}/${id}`).pipe(
    //         tap(() => this.tareasUpdatedSource.next())
    //     );
    // }
}