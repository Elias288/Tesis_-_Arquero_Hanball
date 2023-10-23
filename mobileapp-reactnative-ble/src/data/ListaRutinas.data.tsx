export type secuenciaType = {
  id: string;
  ledId: string;
  time: number;
  resTime?: string | number;
};

export type RutinaType = {
  id: Number;
  title: string;
  secuencia: Array<secuenciaType>;
  jugador?: string;
};

export const ListaRutinas: Array<RutinaType> = [
  {
    id: 1,
    title: 'Secuencia',
    secuencia: [],
  },
  {
    id: 2,
    title: 'Secuencita',
    secuencia: [],
  },
  {
    id: 3,
    title: 'Secuencia 1',
    secuencia: [],
  },
  {
    id: 4,
    title: 'Secuencia 2',
    secuencia: [],
  },
  {
    id: 5,
    title: 'Secuencia 3',
    secuencia: [],
  },
  {
    id: 6,
    title: 'Secuencia 4',
    secuencia: [],
  },
  {
    id: 7,
    title: 'Secuencia 5',
    secuencia: [],
  },
  {
    id: 8,
    title: 'Secuencia 6',
    secuencia: [],
  },
  {
    id: 9,
    title: 'Secuencia 7',
    secuencia: [],
  },
  {
    id: 10,
    title: 'Secuencia 8',
    secuencia: [],
  },
  {
    id: 11,
    title: 'Secuencia 9',
    secuencia: [],
  },
  {
    id: 12,
    title: 'Secuencia 10',
    secuencia: [],
  },
  {
    id: 13,
    title: 'Secuencia 11',
    secuencia: [],
  },
  {
    id: 14,
    title: 'Secuencia 12',
    secuencia: [],
  },
  {
    id: 15,
    title: 'Secuencia 13',
    secuencia: [],
  },
  {
    id: 16,
    title: 'Secuencia 14',
    secuencia: [],
  },
];
