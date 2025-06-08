import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Miembro } from "../dto/Miembro";
import { CreateMiembroDto } from '../dto/CreateMiembroDto';

@Injectable({
    providedIn: 'root'
})

export class MiembroService {
    private baseUrl : string = 'https://tfc-t00f.onrender.com';
    private miembrosUrl : string = '/miembros';

    constructor(private http: HttpClient){ }

    getMiembros(): Observable<Miembro[]>{
        return this.http.get<Miembro[]>(`${this.baseUrl}${this.miembrosUrl}`);
    }

    createMiembro(dto : CreateMiembroDto): Observable<CreateMiembroDto>{
        return this.http.post<CreateMiembroDto>(`${this.baseUrl}${this.miembrosUrl}`, dto)
    }
    
}