import { Proyecto } from "./Proyecto";
import { ProyectoDto } from "./ProyectoDto";

export interface EventoDto{
    
    titulo: string;
    fecha: Date;
    descripcion: string;
    proyecto:ProyectoDto;

}