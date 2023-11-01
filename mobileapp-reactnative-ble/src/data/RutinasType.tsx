export type secuenciaType = {
  id: string;
  ledId: string;
  time: number;
  resTime?: string | number;
};

export type RutinaType = {
  id: string;
  title: string;
  secuencia: Array<secuenciaType>;
  jugadorID?: string;
  createDate: Date;
  playedDate?: Date;
};
