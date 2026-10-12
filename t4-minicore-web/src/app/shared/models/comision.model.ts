// modelo para representar el resultado del calculo de comisiones
export interface Comision {
  vendedor_id: number;
  nombre: string;
  identificacion?: string;
  total_vendido: number;
  porcentaje_comision: number;
  comision_calculada: number;
}
