export function formatDate(fecha: Date){
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0'); // Meses son 0-11
    const day = String(fecha.getDate()).padStart(2, '0');
    const formattedDate : string = `${year}-${month}-${day}`;
    return formattedDate;
}