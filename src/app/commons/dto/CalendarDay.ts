import { Evento } from "./Evento";

export interface CalendarDay{
    fecha: Date;
    event: Evento | null;
}