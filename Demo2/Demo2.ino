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

// orden en el que se encienden las luces
const byte listaSecuencia[] = { 0, 1, 2, 3, 0 };
// tiempo de demora entre secuencias
const int tiempoEncendido[] = { 1000, 2000, 500, 7000, 2000, 1500 };

// matriz con orden y tiempos de cada uno
const int secuenceMatrix[][2] = {
  { 0, 2000 },
  { 1, 2000 },
  { 0, 2000 },
  { 1, 2000 },
  { 0, 2000 },
  { 1, 2000 },
};

// posicion de la lista de secuencia
int indiceActual = -1;
bool gameRun = true;
int buttonpressed = 0;
unsigned long startTime = 0;
unsigned long startTime2 = 0;
unsigned long buttonPressTime = 0;
bool ledOn = true;

void game() {
  if (gameRun == true) {
    unsigned long currentTime = millis();

    if (startTime == 0 || currentTime - startTime >= 5000) {
      buttonpressed = 0;
      digitalWrite(LEDPinArray[listaSecuencia[indiceActual]], LOW); // Apagar el LED actual

      indiceActual = (indiceActual + 1); // Cambiar al siguiente LED
      digitalWrite(LEDPinArray[listaSecuencia[indiceActual]], HIGH); // Encender el siguiente LED
      startTime = currentTime;
    }

    // imprime los segundos
    if (currentTime - startTime2 >= 1000) {
      Serial.println((float) currentTime / 1000);
      startTime2 = currentTime;
    }

    // imprime el tiempo de reaccion
    if (digitalRead(BUTTONPinArray[listaSecuencia[indiceActual]]) == HIGH && buttonpressed == 0) {
      buttonPressTime = currentTime - startTime;
      Serial.print("Tiempo de reacción: ");
      Serial.print(((float) buttonPressTime / 1000));
      Serial.println("s");
      buttonpressed = 1;
    }

    if (indiceActual >= sizeof(listaSecuencia)) {
      gameRun = false;
    }
  }
}

void loop() {
  game();
}
