import { EstadoTarea } from "./EstadoTarea";
import { Miembro } from "./Miembro";
import { ProyectoDto } from "./ProyectoDto";

export interface UpdateTareaDto{
    
    titulo: string;
    descripcion: string;
    fechaInicio: Date;
    fechaFin: Date;
    estado: EstadoTarea;
    proyecto: number ,
    asignadoA:  { idMiembro: number }
    
}