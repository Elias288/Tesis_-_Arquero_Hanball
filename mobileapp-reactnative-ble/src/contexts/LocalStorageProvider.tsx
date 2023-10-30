/*
 * Este contexto comparte entre todos sus componentes hijos las lista de jugadores y
 * rutinas guardadas
 */
import { ReactNode, createContext, useContext } from 'react';

import { JugadorType } from '../data/JugadoresType';
import { RutinaType } from '../data/RutinasType';
import useLocalStorage from '../utils/useLocalStorage';

interface useLocalStorageType {
  jugadores: Array<JugadorType>;
  pushJugador: (newJugador: JugadorType) => void;
  clearJugadoresDB: () => void;
  popJugador: (jugadorId: number) => void;
  updateJugador: (newJugador: JugadorType) => void;
  findJugador: (
    jugadorName: string | undefined,
    jugadorId: number | undefined
  ) => JugadorType | undefined;
  rutinas: Array<RutinaType>;
  pushRutina: (newRutina: RutinaType) => void;
  popRutina: (rutinaId: number) => void;
  findRutina: (
    rutinaTitle: string | undefined,
    rutinaId: number | undefined
  ) => RutinaType | undefined;
  rutinasRealizadas: Array<RutinaType>;
  pushRutinaRealizada: (newRutina: RutinaType) => void;
  popRutinaRealizada: (rutinaId: number) => void;
  clearRutinasRealizadas: () => void;
  getRutinasJugadasDeJugador: (jugadorId: number) => Array<RutinaType>;
}

const LocalStorageContext = createContext<useLocalStorageType | undefined>(undefined);

const LocalStorageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <LocalStorageContext.Provider value={useLocalStorage()}>
      {children}
    </LocalStorageContext.Provider>
  );
};

export const useCustomLocalStorage = () => {
  const context = useContext(LocalStorageContext);
  if (!context) {
    throw new Error('useLocalStorage debe ser utilizado dentro de un LocalStorageProvider');
  }
  return context;
};

export default LocalStorageProvider;
