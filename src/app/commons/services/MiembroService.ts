import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Miembros } from "../dto/Miembros";

@Injectable({
    providedIn: 'root'
})

export class MiembroService {
    private baseUrl : string = 'http://localhost:8080';
    private miembrosUrl : string = '/miembros';

    constructor(private http: HttpClient){ }

    getMiembros(): Observable<Miembros[]>{
        return this.http.get<Miembros[]>(`${this.baseUrl}${this.miembrosUrl}`);
    }

}