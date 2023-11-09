export type JugadorType = {
  _id?: string;
  nombre: string;
  fechaCreación: Date;
  cedula?: string;
  localidad?: string;
  resultados?: Array<string>;
};
