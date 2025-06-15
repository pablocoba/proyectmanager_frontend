export interface CreateDocumentoDto{
    nombreArchivo: string;
    rutaArchivo: string;
    proyecto: {
        idProyecto: number;
    }
}