import { secuenciaType } from './RutinasType';

export type ResultadoType = {
  d: number;
  titulo: string;
  eateDate: Date;
  secuencia: Array<secuenciaType>;
  jugadorID?: number;
  playedDate?: Date;
};
