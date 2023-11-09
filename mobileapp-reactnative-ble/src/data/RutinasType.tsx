export type secuenciaType = {
  id: string;
  ledId: string;
  tiempo: number;
  resTime?: string | number;
};

export type RutinaType = {
  _id?: string;
  titulo: string;
  fechaDeCreación: Date;
  id_usuario?: string;
  secuencias: string;
};
