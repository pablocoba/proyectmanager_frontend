import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { map, Observable } from "rxjs";
import { Miembro } from "../dto/Miembro";
import { CreateMiembroDto } from '../dto/CreateMiembroDto';
import { MiembroDto } from '../dto/MiembroDto';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})

export class MiembroService {
    private baseUrl : string = 'https://tfc-t00f.onrender.com';
    private miembrosUrl : string = '/miembros';

    constructor(
        private http: HttpClient,
        @Inject(PLATFORM_ID) private platformId: Object,
    ){ }

    getMiembros(): Observable<Miembro[]>{
        return this.http.get<Miembro[]>(`${this.baseUrl}${this.miembrosUrl}`);
    }

    createMiembro(dto : CreateMiembroDto): Observable<CreateMiembroDto>{
        return this.http.post<CreateMiembroDto>(`${this.baseUrl}${this.miembrosUrl}`, dto)
    }
    
    getMiembrosDto():Observable<MiembroDto[]>{
        return this.http.get<MiembroDto[]>(`${this.baseUrl}${this.miembrosUrl}`);
    }

    getMiembroActual():Observable<MiembroDto | null>{
        let username : string;
        if(isPlatformBrowser(this.platformId)){
            username = localStorage.getItem('username')!;
        }
        return this.getMiembrosDto().pipe(
            map(miembros => miembros.find(m => m.nombreUsuario === username) || null)            
        )
    }
    
}