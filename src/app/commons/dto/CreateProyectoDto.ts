import { Miembro } from "./Miembro";

export interface CreateProyectoDto {
    nombre : string;
    descripcion : string;
    fechaInicio : string;
    fechaFin : string;
    miembros: Miembro[];
}