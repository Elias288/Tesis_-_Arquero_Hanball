/* 
* Necesitamos configurar la placa ESP32 como servidor BLE que reciba una secuencia, ejecute el
* el juego y envie una respuesta hacia el celular.
*/
#define LED_1 19
#define LED_2 18
#define LED_3 5
#define LED_4 17

#define BUTTON_1 34
#define BUTTON_2 35
#define BUTTON_3 32
#define BUTTON_4 25

#define CANT_CAMPS 4

#include "Blecontroller.h"

const byte LEDPinArray[4] = {
  LED_1,
  LED_2,
  LED_3,
  LED_4
};
const byte BUTTONPinArray[4] = {
  BUTTON_1,
  BUTTON_2,
  BUTTON_3,
  BUTTON_4
};

void initComponents() {
  for (int i = 0; i < CANT_CAMPS; i++) {
    pinMode(LEDPinArray[i], OUTPUT);
    pinMode(BUTTONPinArray[i], INPUT);
  }
}

void setup() {
  Serial.begin(115200);
  initBLE();
  initComponents();
}

void loop() {
  connectBLE(LEDPinArray, BUTTONPinArray);
}
