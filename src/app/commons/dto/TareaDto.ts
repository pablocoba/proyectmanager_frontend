import { EstadoTarea } from "./EstadoTarea";
import { Miembro } from "./Miembro";
import { ProyectoDto } from "./ProyectoDto";

export interface TareaDto{
    
    titulo: string;
    descripcion: string;
    fechaInicio: Date;
    fechaFin: Date;
    estado: EstadoTarea;
    proyecto:{ idProyecto: number },
    asignadoA:  { idMiembro: number }
    
}