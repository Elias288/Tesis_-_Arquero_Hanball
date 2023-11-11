export type UsuarioType = {
  _id: String;
  username: String;
  contrasenia: String;
  nombre?: String;
  rutinas?: Array<String>;
  jugadores?: Array<String>;
};
