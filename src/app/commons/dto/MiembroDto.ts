import { MiembroProyectoDto } from "./MiembroProyectoDto";

export interface MiembroDto {
  idMiembro: number;
  nombreUsuario: string;
  correo: string;
  tareasAsignadas: number[];
  mensajesEnviados: number[];
  proyectos: MiembroProyectoDto[];
}