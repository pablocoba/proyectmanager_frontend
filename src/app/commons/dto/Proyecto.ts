import { Documento } from "./Documento";
import { Evento } from "./Evento";
import { Mensaje } from "./Mensaje";
import { Miembro } from "./Miembro";
import { Tarea } from "./Tarea";

export interface Proyecto {
    idProyecto : number;
    nombre : string;
    descripcion : string;
    fechaInicio : Date;
    fechaFin : Date;
    idTareas: Tarea[];
    idDocumentos: Documento[];
    idEventos: Evento[];
    idMensajes: Mensaje[];
    miembros: Miembro[];
}