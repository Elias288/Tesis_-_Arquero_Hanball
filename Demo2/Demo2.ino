#define LED_1 19
#define LED_2 18
#define LED_3 5
#define LED_4 17

#define BUTTON_1 34
#define BUTTON_2 35
#define BUTTON_3 32
#define BUTTON_4 25

// tamaño maximo de secuencia
#define CANT_SECUENCIA 10
// cantidad de componentes a utilizar, 4 leds, 4 botones
#define CANT_COMPS 4

const byte LEDPinArray[CANT_COMPS] = { LED_1, LED_2, LED_3, LED_4 };
const byte BUTTONPinArray[CANT_COMPS] = { BUTTON_1, BUTTON_2, BUTTON_3, BUTTON_4 };

void initLeds() {
  for (int i = 0; i < CANT_COMPS; i++) {
    pinMode(LEDPinArray[i], OUTPUT);
  }
}
void initButtons() {
  for (int i = 0; i < CANT_COMPS; i++) {
    pinMode(BUTTONPinArray[i], INPUT);
  }
}

void setup() {
  initLeds();
  initButtons();
  Serial.begin(9600);
}

void blink() {
  for (int i = 0; i < CANT_COMPS; i++) {
    digitalWrite(LEDPinArray[i], HIGH);
  }
  delay(1000);

  for (int i = 0; i < CANT_COMPS; i++) {
    digitalWrite(LEDPinArray[i], LOW);
  }
  delay(1000);
}

int estadoBoton1;
int estadoBoton2;
int estadoBoton3;
int estadoBoton4;
int ultimoEstadoBoton1 = LOW;
int ultimoEstadoBoton2 = LOW;
int ultimoEstadoBoton3 = LOW;
int ultimoEstadoBoton4 = LOW;
int estadoled1 = LOW;
int estadoled2 = LOW;
int estadoled3 = LOW;
int estadoled4 = LOW;

void inout() {
  estadoBoton1 = digitalRead(BUTTON_1);
  estadoBoton2 = digitalRead(BUTTON_2);
  estadoBoton3 = digitalRead(BUTTON_3);
  estadoBoton4 = digitalRead(BUTTON_4);

  if (estadoBoton1 == LOW && ultimoEstadoBoton1 == HIGH) {
    estadoled1 = !estadoled1;
    Serial.println("led1");
    digitalWrite(LED_1, estadoled1);
  }
  if (estadoBoton2 == LOW && ultimoEstadoBoton2 == HIGH) {
    estadoled2 = !estadoled2;
    Serial.println("led2");
    digitalWrite(LED_2, estadoled2);
  }
  if (estadoBoton3 == LOW && ultimoEstadoBoton3 == HIGH) {
    estadoled3 = !estadoled3;
    Serial.println("led3");
    digitalWrite(LED_3, estadoled3);
  }
  if (estadoBoton4 == LOW && ultimoEstadoBoton4 == HIGH) {
    estadoled4 = !estadoled4;
    Serial.println("led4");
    digitalWrite(LED_4, estadoled4);
  }
  delay(100);
  ultimoEstadoBoton1 = estadoBoton1;
  ultimoEstadoBoton2 = estadoBoton2;
  ultimoEstadoBoton3 = estadoBoton3;
  ultimoEstadoBoton4 = estadoBoton4;
}

// orden en el que se encienden las luces
const byte listaSecuencia[] = { 1, 3, 0, 2, 0, 2 };
// posicion de la lista de secuencia
int indiceActual = 0;
int buttonpressed;
bool gameRun = true;
void game() {
  // si el boton en la posicion que corresponda en la lista de secuencia es el correcto
  buttonpressed = digitalRead(BUTTONPinArray[listaSecuencia[indiceActual]]);

  if (buttonpressed == HIGH && gameRun == true) {
    // apaga el led actual
    digitalWrite(LEDPinArray[listaSecuencia[indiceActual]], LOW);

    // pasa al siguiente led de la secuencia
    Serial.println((String) "Indice actual: " + listaSecuencia[indiceActual]);
    indiceActual++;

    // Verificar si se alcanzó el final del array
    if (indiceActual >= sizeof(listaSecuencia)) {
      Serial.println("Fin del programa");
      // finaliza el programa
      gameRun = false;
      // resetea el indice
      indiceActual = 0;
    }
  }

  if (gameRun == true) {
  // enciende el led actual
    digitalWrite(LEDPinArray[listaSecuencia[indiceActual]], HIGH);
  }
  delay(100);
}

void loop() {
  // blink();
  // inout();
  game();
}
