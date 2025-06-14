// current-proyecto.service.ts
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { MiembroProyectoDto } from '../dto/MiembroProyectoDto';
import { MiembroService } from './MiembroService';
import { map, switchMap, tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class CurrentProyectoService {

    private readonly LOCAL_STORAGE_KEY = 'proyectoActual';
    private proyectoActual = new BehaviorSubject<number | null>(null);
    proyectoActual$ = this.proyectoActual.asObservable();

    constructor(
        private miembroService: MiembroService,
        @Inject(PLATFORM_ID) private platformId:Object
    ) {
        this.inicializarProyecto();
    }

    // Métodos de localStorage
    private obtenerProyectoDeLocalStorage(): number | null {
    // Verifica si estamos en el navegador (donde localStorage existe)
    if (isPlatformBrowser(this.platformId)) {
      const proyectoId = localStorage.getItem('currentProyectoId');
      return proyectoId ? parseInt(proyectoId) : null;
    }
    return null;
  }

    private guardarProyectoEnLocalStorage(idProyecto: number): void {
        localStorage.setItem(this.LOCAL_STORAGE_KEY, idProyecto.toString());
        console.log('cacacacacacacac',localStorage.getItem(this.LOCAL_STORAGE_KEY))
    }

    private limpiarProyectoDeLocalStorage(): void {
        localStorage.removeItem(this.LOCAL_STORAGE_KEY);
    }

    // Método de inicialización corregido
    private inicializarProyecto(): void {
        const proyectoGuardado = this.obtenerProyectoDeLocalStorage();

        if (proyectoGuardado !== null) {
            this.verificarProyecto(proyectoGuardado).subscribe(esValido => {
                if (esValido) {
                    this.establecerProyectoActual(proyectoGuardado, false);
                } else {
                    this.seleccionarPrimerProyecto();
                }
            });
        } else {
            this.seleccionarPrimerProyecto();
        }
    }

    private verificarProyecto(idProyecto: number): Observable<boolean> {
        return this.miembroService.getMiembroActual().pipe(
            map(miembro => {
                return miembro?.proyectos?.some(p => p.idProyecto === idProyecto) ?? false;
            })
        );
    }

    private establecerProyectoActual(idProyecto: number, guardarEnStorage: boolean = true): void {
        console.log("estableciendo proyecto :", idProyecto)
        this.proyectoActual.next(idProyecto);
        if (guardarEnStorage) {
            this.guardarProyectoEnLocalStorage(idProyecto);
        }
    }

    public establecerPrimerProyectoSiNecesario(): void {
        if (this.obtenerProyectoActual() === null) {
            this.seleccionarPrimerProyecto();
        }
        }

    // Modifica el método seleccionarPrimerProyecto para hacerlo público
    public seleccionarPrimerProyecto(): void {
    this.miembroService.getMiembroActual().subscribe({
        next: (miembro) => {
        if (miembro?.proyectos && miembro.proyectos.length > 0) {
            this.establecerProyectoActual(miembro.proyectos[0].idProyecto);
        }
        },
        error: (err) => console.error('Error al obtener miembro', err)
    });
    }

    // Métodos públicos
    public cambiarProyecto(idProyecto: number): Observable<boolean> {
        return this.verificarProyecto(idProyecto).pipe(
            tap(esValido => {
                console.log('valido!!', esValido);
                if (esValido) {
                    console.log('cambianddo cambiandooooo');
                    this.establecerProyectoActual(idProyecto);
                    localStorage.setItem('proyectoActual', idProyecto.toString());
                }
            })
        );
    }

    public obtenerProyectoActual(): number | null {
        return this.proyectoActual.value;
    }

    public obtenerProyectoSeleccionado(): Observable<MiembroProyectoDto | null> {
        return this.miembroService.getMiembroActual().pipe(
            map(miembro => {
                const idActual = this.proyectoActual.value;
                if (!miembro || !idActual) return null;
                return miembro.proyectos.find(p => p.idProyecto === idActual) || null;
            })
        );
    }

}