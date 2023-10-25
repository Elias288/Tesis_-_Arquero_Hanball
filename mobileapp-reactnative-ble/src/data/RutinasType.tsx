export type secuenciaType = {
  id: string;
  ledId: string;
  time: number;
  resTime?: string | number;
};

export type RutinaType = {
  id: number;
  title: string;
  secuencia: Array<secuenciaType>;
  jugador?: string;
};
