#ifndef Game_h
#define Game_h

#define LED_1 19
#define LED_2 18
#define LED_3 5
#define LED_4 17

#define BUTTON_1 34
#define BUTTON_2 35
#define BUTTON_3 32
#define BUTTON_4 25

#include <Arduino.h>
#include "HardwareSerial.h"
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
  for (int i = 0; i < getCantComps(); i++) {
    pinMode(LEDPinArray[i], OUTPUT);
    pinMode(BUTTONPinArray[i], INPUT);
  }
}

int indiceActual = 0;  // posicion de la lista de secuencia
int indiceToSecuenciaDeReaccion = 0;
bool gameRun = false;  // indicador de juego ejecutandose
bool startGame = false;
int blinkCount = 2;
int buttonpressed = 0;        // indicador de boton pulsao
unsigned long startTime = 0;  // tiempo de inicio

void blink() {
  for (int i = 0; i < getCantComps(); i++) {
    digitalWrite(LEDPinArray[i], HIGH);
  }
  delay(500);

  for (int i = 0; i < getCantComps(); i++) {
    digitalWrite(LEDPinArray[i], LOW);
  }
  Serial.println("Blink");
  delay(500);
}

// ******************************************** Imprimir tiempo ********************************************
unsigned long startTime2 = 0;
void printTime(long currentTime, int indiceActual) {
  Serial.print(indiceActual);
  Serial.print(" - ");
  Serial.print("Led: [");
  Serial.print(getSecuenceMatrix(indiceActual, 0).toInt() + 1);
  Serial.print("][");
  Serial.print(getSecuenceMatrix(indiceActual, 1).toInt());
  Serial.print("] - ");
  Serial.println((float)currentTime / 1000);
  startTime2 = currentTime;
}

// ************************************** Crea la lista de resultados **************************************
// int indiceSecuencia = 0;
// void pushToSecuenciaDeReaccion(String led, long time) {
//   secuenciaDeReaccion[indiceSecuencia][0] = led;
//   secuenciaDeReaccion[indiceSecuencia][1] = time;

//   Serial.print(indiceSecuencia);
//   Serial.print("- led: ");
//   Serial.print(led);
//   Serial.print("- time: ");
//   Serial.println(time);

//   indiceSecuencia++;
// }

// ******************************************* Función Principal *******************************************
void game() {
  if (getInitGame()) {
    indiceActual = 0;
    blink();
    blinkCount = blinkCount - 1;

    if (blinkCount == 0) {
      setInitGame(false);
      gameRun = true;
    }
  }
  if (gameRun) {
    unsigned long currentTime = millis();

    // ************************ Si el indice actual llega al final de la secuencia ************************
    if (indiceActual >= 10 || getSecuenceMatrix(indiceActual, 0) == "") {
      blink();
      setInitGame(false);
      gameRun = false;
      Serial.println("Game over");
      blinkCount = 2;
      return;
      // if (isDeviceConnected()) {
      //   sendData("1");
      // }
    }

    // ******* Si el tiempo actual menos el tiempo de inicio es mayor o igual al tiempo en segundos *******
    if (startTime != 0 && currentTime - startTime >= getSecuenceMatrix(indiceActual, 1).toInt()) {
      digitalWrite(LEDPinArray[getSecuenceMatrix(indiceActual, 0).toInt()], LOW);  // Apagar el LED actual
      buttonpressed = 0;

      indiceActual++;  // Cambiar al siguiente LED

      if (getSecuenceMatrix(indiceActual, 0) != "") {
        digitalWrite(LEDPinArray[getSecuenceMatrix(indiceActual, 0).toInt()], HIGH);  // Encender el siguiente LED

        startTime = currentTime;
      } else {
        return;
      }
    } else if (startTime == 0) {
      Serial.println("first on");
      digitalWrite(LEDPinArray[getSecuenceMatrix(indiceActual, 0).toInt()], HIGH);  // Encender el primer LED
      startTime = currentTime;
    }

    if (currentTime - startTime2 >= 1000) {
      printTime(currentTime, indiceActual);
      startTime2 = currentTime;
    }

    // ********************************** imprime el tiempo de reaccion **********************************
    if (digitalRead(BUTTONPinArray[getSecuenceMatrix(indiceActual, 0).toInt()]) == HIGH && buttonpressed == 0) {
      unsigned long buttonPressTime = currentTime - startTime;
      Serial.print("Tiempo de reacción: ");
      Serial.print(((float)buttonPressTime / 1000));
      Serial.println("s");
      buttonpressed = 1;

      pushToSecuenciaDeReaccion(indiceToSecuenciaDeReaccion, getSecuenceMatrix(indiceActual, 0), String(buttonPressTime));
      indiceToSecuenciaDeReaccion++;
    }
  }
}

#endif