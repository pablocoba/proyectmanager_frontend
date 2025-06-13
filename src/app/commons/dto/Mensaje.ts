import { Miembro } from "./Miembro";
import { Proyecto } from "./Proyecto";

export interface Mensaje{
    idMensaje : number,
    idProyecto : number,
    idMiembro : number,
    fechaHora : string,
    nombreUsuario : string,
    contenido : string
}