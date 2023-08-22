#define LED_1 21
#define LED_2 19
#define LED_3 18
#define LED_4 5

#define BUTTON_1 34
#define BUTTON_2 35
#define BUTTON_3 32
#define BUTTON_4 33

// cantidad de componentes a utilizar, 4 leds, 4 botones
#define CANT_COMPS 4

const byte LEDPinArray[CANT_COMPS] = {
  LED_1,
  LED_2,
  LED_3,
  LED_4
};
const byte BUTTONPinArray[CANT_COMPS] = {
  BUTTON_1,
  BUTTON_2,
  BUTTON_3,
  BUTTON_4
};

void initComponents() {
  for (int i = 0; i < CANT_COMPS; i++) {
    pinMode(LEDPinArray[i], OUTPUT);
    pinMode(BUTTONPinArray[i], INPUT);
  }
}

void setup() {
  initComponents();
  Serial.begin(9600);
}
// matriz con orden y tiempos de cada uno
const int secuenceMatrix[][2] = {
  { 1, 500 },
  { 3, 1000 },
  { 0, 2000 },
  { 2, 500 },
  { 1, 4000 },
  { 2, 1000 },
};

int indiceActual = 0;        // posicion de la lista de secuencia
bool gameRun = true;          // indicador de juego ejecutandose
int buttonpressed = 0;        // indicador de boton pulsao
unsigned long startTime = 0;  // tiempo de inicio
unsigned long startTime2 = 0;

void printTime(long currentTime) {
  Serial.print("Led: [");
  Serial.print(secuenceMatrix[indiceActual][0] + 1);
  Serial.print("][");
  Serial.print(secuenceMatrix[indiceActual][1]);
  Serial.print("] - ");
  Serial.println((float)currentTime / 1000);
  startTime2 = currentTime;
}

void game() {
  if (gameRun) {
    unsigned long currentTime = millis();

    // si el indice actual llega al final de la secuencia
    if (indiceActual >= (sizeof(secuenceMatrix) / sizeof(secuenceMatrix[0]))) {
      gameRun = false;
      Serial.println("Game over");
    }

    // si el tiempo actual menos el tiempo de inicio es mayor o igual al tiempo en segundos
    if ( startTime != 0 && currentTime - startTime >= secuenceMatrix[indiceActual][1]) {
      digitalWrite(LEDPinArray[secuenceMatrix[indiceActual][0]], LOW);  // Apagar el LED actual
      buttonpressed = 0;

      indiceActual = (indiceActual + 1); // Cambiar al siguiente LED

      digitalWrite(LEDPinArray[secuenceMatrix[indiceActual][0]], HIGH);  // Encender el siguiente LED
      startTime = currentTime;

    } else if (startTime == 0 ) {
      digitalWrite(LEDPinArray[secuenceMatrix[indiceActual][0]], HIGH);  // Encender el primer LED
      startTime = currentTime;
    }

    if (currentTime - startTime2 >= secuenceMatrix[indiceActual][1]) {
      printTime(currentTime);
      startTime2 = currentTime;
    }

    // imprime el tiempo de reaccion
    if (digitalRead(BUTTONPinArray[secuenceMatrix[indiceActual][0]]) == HIGH && buttonpressed == 0) {
      unsigned long buttonPressTime = currentTime - startTime;
      Serial.print("Tiempo de reacción: ");
      Serial.print(((float)buttonPressTime / 1000));
      Serial.println("s");
      buttonpressed = 1;
    }
  }
}

void buttonPessedISR() {
  buttonpressed = true;
}

void loop() {
  game();
}
