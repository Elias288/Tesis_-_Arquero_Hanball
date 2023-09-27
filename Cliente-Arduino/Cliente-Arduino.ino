/* 
* Necesitamos configurar la placa ESP32 como servidor BLE que reciba una secuencia, ejecute el
* el juego y envie una respuesta hacia el celular.
*/
#include "Blecontroller.h"
#include "Game.h"

void setup() {
  Serial.begin(115200);
  initBLE();
  initComponents();
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

void loop() {
  // blink();
  connectBLE();
  game();
  // inout();
}
