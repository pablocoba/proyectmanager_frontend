import { CreateMsgMiembroDto } from "./CreateMsgMiembroDto";
import { CreateMsgProyectoDto } from "./CreateMsgProyectoDto";
import { Miembro } from "./Miembro";
import { Proyecto } from "./Proyecto";
import { ProyectoDto } from "./ProyectoDto";

export interface MensajeDto{
    proyecto : CreateMsgProyectoDto,
    miembro : CreateMsgMiembroDto,
    fechaHora : Date,
    contenido : string
}