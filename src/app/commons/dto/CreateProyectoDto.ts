import { Miembro } from "./Miembro";
import { MiembroDto } from "./MiembroDto";
import { MiembroProyectoDto } from "./MiembroProyectoDto";

export interface CreateProyectoDto {
    nombre : string;
    descripcion : string;
    fechaInicio : Date;
    fechaFin : Date;
    miembrosProyecto: { miembro: { idMiembro: number } }[];
}