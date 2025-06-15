export interface Tarea {
    idTarea : number;
    titulo : string;
    descripcion : string;
    fechaInicio : Date;
    fechaFin : Date;
    estado : string;
    idProyecto : number;
    idMiembro : number;
}