# Tesis - Arquero Hanball

## Iniciando

Para inicializar este proyecto despues de clonado el repositorio en local o descargado los archivos, se deberá instalar las dependencias tanto de la aplicación movil como de la api.

### Apliación Movil

Para descargar las dependencias se deberá entrar a la carpeta del proyecto `mobileapp-reactnative-ble` y ejecutar el siguiente comando que se encargará de instalar todo lo necesario:

```sh
npm install
```

Cuando finalice de descargar las dependencias se deberá configurar el archivo `.env` con las variables de entorno (no es necesario que contenga las url de la api en la primera ejecución), para configura en archivo `.env` simplemente se tendrá que duplicar el archivo `env.template` y cambiarle el nombre por `.env` dejado en la carpeta raiz de este proyecto.

Ya con eso realizado se podrá ejecutar el siguiente comando para iniciar el proyecto

```sh
npm start
```

### API

Para descargar las dependencias se deberá entrar a la carpeta del proyecto `DEAH-API` y ejecutar el siguiente comando que se encargará de instalar todo lo necesario:

```sh
npm install
```

Cuando finalice de descargar las dependencias se deberá configurar el archivo `.env` con las variables de entorno, para configura en archivo `.env` simplemente se tendrá que duplicar el archivo `env.template` y cambiarle el nombre por `.env` dejado en la carpeta raiz de este proyecto. Es necesario que para la api ya se tenga la url de un documento mongo y se coloque en la variable de entorno `MongoDB_URL` y contar con un string para el `JWT_Secret` que servirá para la generación de tokens.

Ya con eso realizado se podrá ejecutar el siguiente comando para iniciar el proyecto

```sh
npm start
```

---

## Caracteristicas

### Jugador

- **Almacenamiento Local**
  - CRUD de jugador (crear, eliminar y modificar).
  - Lista de jugadores (simple y detallada).
  - Ver información de Jugador (datos registrados y rutinas realizadas).
  - Seleccionar jugador al inciar rutina.
- **Almacenamiento Remoto**
  - CRUD de jugador  (crear, eliminar y modificar).
  - Listar rutinas realizadas del jugador.

### Rutinas

- crear rutina aleatoria.
- **Almacenamiento Local**
  - CRUD de rutinas (crear y eliminar).
  - Lista de rutinas (simple y detalla).
  - Ver información de rutina (datos registrados).
  - Iniciar juego con rutina seleccionada.
- **Almacenamiento Remoto**
  - CRUD de rutina (crear, eliminar y modificar)
  - Listar rutinas

### Rutinas realizadas

- **Almacenamiento Local**
  - CRUD de rutina realizada (crear y eliminar).
  - Lista de rutinas realizadas (simple y detallada).
  - Ver información de rutina realizada (datos registrados y jugador que la realizó)
- **Almacenamiento Remoto**
  - CRUD de rutina realizada (crear, eliminar y modificar)
  - Listar rutinas
