import { EstadoTarea } from "./EstadoTarea";
import { Miembro } from "./Miembro";
import { Proyecto } from "./Proyecto";
import { ProyectoDto } from "./ProyectoDto";

export interface TareaDto{
    
    titulo: string;
    descripcion: string;
    fechaInicio: Date;
    fechaFin: Date;
    estadoTarea: EstadoTarea;
    proyecto:ProyectoDto;
    asignadoA: Miembro;

}