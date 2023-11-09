import { secuenciaType } from './RutinasType';

export type ResultadoType = {
  _id: string;
  titulo: string;
  createDate: Date;
  titulo_rutina: string;
  secuencias: Array<secuenciaType>;
  id_jugador: string;
  playedDate: Date;
};
