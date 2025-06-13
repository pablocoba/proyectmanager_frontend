import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'descTruncate'
})
export class DescTruncatePipe implements PipeTransform {

  transform(value: string | null | undefined, maxLength: number = 95): string {
    // Si el valor no es una cadena o es nulo/indefinido, devuelve una cadena vacía o el valor original.
    if (typeof value !== 'string') {
      return ''; // O puedes devolver el valor tal cual si prefieres: return value;
    }

    // Si la longitud de la cadena es menor o igual a la longitud máxima, devuelve la cadena original.
    if (value.length <= maxLength) {
      return value;
    }

    // Trunca la cadena y añade puntos suspensivos.
    return value.substring(0, maxLength) + '...';
  }

}

@Pipe({
  name: 'titleTruncate'
})
export class TitleTruncatePipe implements PipeTransform {

  transform(value: string | null | undefined, maxLength: number = 20): string {
    // Si el valor no es una cadena o es nulo/indefinido, devuelve una cadena vacía o el valor original.
    if (typeof value !== 'string') {
      return ''; // O puedes devolver el valor tal cual si prefieres: return value;
    }

    // Si la longitud de la cadena es menor o igual a la longitud máxima, devuelve la cadena original.
    if (value.length <= maxLength) {
      return value;
    }

    // Trunca la cadena y añade puntos suspensivos.
    return value.substring(0, maxLength) + '...';
  }

}

@Pipe({
  name: 'tareaTruncate'
})
export class TareaTruncatePipe implements PipeTransform {

  transform(value: string | null | undefined, maxLength: number = 25): string {
    // Si el valor no es una cadena o es nulo/indefinido, devuelve una cadena vacía o el valor original.
    if (typeof value !== 'string') {
      return ''; // O puedes devolver el valor tal cual si prefieres: return value;
    }

    // Si la longitud de la cadena es menor o igual a la longitud máxima, devuelve la cadena original.
    if (value.length <= maxLength) {
      return value;
    }

    // Trunca la cadena y añade puntos suspensivos.
    return value.substring(0, maxLength) + '...';
  }

}

@Pipe({
  name: 'tareaTitleTruncate'
})
export class TareaTitleTruncatePipe implements PipeTransform {

  transform(value: string | null | undefined, maxLength: number = 18): string {
    // Si el valor no es una cadena o es nulo/indefinido, devuelve una cadena vacía o el valor original.
    if (typeof value !== 'string') {
      return ''; // O puedes devolver el valor tal cual si prefieres: return value;
    }

    // Si la longitud de la cadena es menor o igual a la longitud máxima, devuelve la cadena original.
    if (value.length <= maxLength) {
      return value;
    }

    // Trunca la cadena y añade puntos suspensivos.
    return value.substring(0, maxLength) + '...';
  }

}