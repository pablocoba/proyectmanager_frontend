export interface MiembroProyectoDto {
  id: number;
  idMiembro: number;
  idProyecto: number;
  rol: string;
  fechaIncorporacion: Date | null;
  nombreProyecto: string;
  nombreMiembro: string;
}