/* 
* Necesitamos configurar la placa ESP32 como servidor BLE que reciba una secuencia, ejecute el
* el juego y envie una respuesta hacia el celular.
*/
#include "Blecontroller.h"

#define LED_1 19
#define LED_2 18
#define LED_3 5
#define LED_4 17

#define BUTTON_1 34
#define BUTTON_2 35
#define BUTTON_3 32
#define BUTTON_4 25

// **************************************** Cantidad de componentes ****************************************
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

// ********************************* matriz con orden y tiempos de cada uno *********************************
const int secuenceMatrix[][2] = {
  { 0, 2000 },  // LED_1
  { 1, 3000 },  // LED_2
  { 2, 4000 },  // LED_3
  { 3, 5000 },  // LED_4
  { 0, 4000 },  // LED_1
  { 1, 1000 },  // LED_2
};
int secuenciaDeReaccion[][2] = {};
// **********************************************************************************************************

void initComponents() {
  for (int i = 0; i < CANT_COMPS; i++) {
    pinMode(LEDPinArray[i], OUTPUT);
    pinMode(BUTTONPinArray[i], INPUT);
  }
}

void setup() {
  Serial.begin(115200);
  initBLE();
  initComponents();
}

// ******************************************** Imprimir tiempo ********************************************
unsigned long startTime2 = 0;
void printTime(long currentTime, int indiceActual) {
  Serial.print("Led: [");
  Serial.print(secuenceMatrix[indiceActual][0] + 1);
  Serial.print("][");
  Serial.print(secuenceMatrix[indiceActual][1]);
  Serial.print("] - ");
  Serial.println((float)currentTime / 1000);
  startTime2 = currentTime;
}
// *********************************************************************************************************

// ************************************ funcion que parpadea las luces ************************************
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

// ************************************* funcion para testear botones *************************************
void inout() {
  if (digitalRead(BUTTON_1) == HIGH) {
    Serial.println("led1");
    digitalWrite(LED_1, HIGH);
  }
  if (digitalRead(BUTTON_2) == HIGH) {
    Serial.println("led2");
    digitalWrite(LED_2, HIGH);
  }
  if (digitalRead(BUTTON_3) == HIGH) {
    Serial.println("led3");
    digitalWrite(LED_3, HIGH);
  }
  if (digitalRead(BUTTON_4) == HIGH) {
    Serial.println("led4");
    digitalWrite(LED_4, HIGH);
  }

  delay(100);
  digitalWrite(LED_1, LOW);
  digitalWrite(LED_2, LOW);
  digitalWrite(LED_3, LOW);
  digitalWrite(LED_4, LOW);
}
// *********************************************************************************************************

// ************************************** Crea la lista de resultados **************************************
int indiceSecuencia = 0;
void pushToSecuenciaDeReaccion(int led, long time) {
  secuenciaDeReaccion[indiceSecuencia][0] = led;
  secuenciaDeReaccion[indiceSecuencia][1] = time;

  Serial.print(indiceSecuencia);
  Serial.print("- led: ");
  Serial.print(led);
  Serial.print("- time: ");
  Serial.println(time);

  indiceSecuencia++;
}

// ******************************************* Función Principal *******************************************
int indiceActual = 0;  // posicion de la lista de secuencia
bool gameRun = false;  // indicador de juego ejecutandose
bool startGame = true;
int blinkCount = 2;
int buttonpressed = 0;        // indicador de boton pulsao
unsigned long startTime = 0;  // tiempo de inicio
void game() {
  if (startGame) {
    blink();
    blinkCount = blinkCount - 1;

    if (blinkCount == 0) {
      startGame = false;
      gameRun = true;
    }
  }
  if (gameRun) {
    unsigned long currentTime = millis();

    // si el indice actual llega al final de la secuencia
    if (indiceActual >= (sizeof(secuenceMatrix) / sizeof(secuenceMatrix[0]))) {
      gameRun = false;
      Serial.println("Game over");
      if (deviceConnected) {
        sendData("1");
      }
    }

    // si el tiempo actual menos el tiempo de inicio es mayor o igual al tiempo en segundos
    if (startTime != 0 && currentTime - startTime >= secuenceMatrix[indiceActual][1]) {
      digitalWrite(LEDPinArray[secuenceMatrix[indiceActual][0]], LOW);  // Apagar el LED actual
      buttonpressed = 0;

      indiceActual = (indiceActual + 1);  // Cambiar al siguiente LED

      digitalWrite(LEDPinArray[secuenceMatrix[indiceActual][0]], HIGH);  // Encender el siguiente LED
      startTime = currentTime;
    } else if (startTime == 0) {
      digitalWrite(LEDPinArray[secuenceMatrix[indiceActual][0]], HIGH);  // Encender el primer LED
      startTime = currentTime;
    }

    if (currentTime - startTime2 >= secuenceMatrix[indiceActual][1]) {
      printTime(currentTime, indiceActual);
      startTime2 = currentTime;
    }

    // imprime el tiempo de reaccion
    if (digitalRead(BUTTONPinArray[secuenceMatrix[indiceActual][0]]) == HIGH && buttonpressed == 0) {
      unsigned long buttonPressTime = currentTime - startTime;
      Serial.print("Tiempo de reacción: ");
      Serial.print(((float)buttonPressTime / 1000));
      Serial.println("s");
      buttonpressed = 1;

      pushToSecuenciaDeReaccion(secuenceMatrix[indiceActual][0], buttonPressTime);
    }
  }
}
// *********************************************************************************************************

void loop() {
  // game();
  // blink();
  connectBLE();
  // inout();
}
