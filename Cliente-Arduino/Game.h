#ifndef Game_h
#define Game_h

#include <Arduino.h>

int indiceActual = 0;          // posicion de la lista de secuencia
int buttonpressed = 0;         // indicador de boton pulsao
bool startGame = true;         // inicia el blink inicial del juego
unsigned long startTime = 0;   // tiempo de inicio
unsigned long startTime2 = 0;  // tiempo para mostrar en serial
int indiceToSecuenciaDeReaccion = 0;

// ********************************************************* blink *********************************************************
void blink(int cantRep, long interval, const byte *LEDPinArray) {
  /*
   * Esta función recibe la cantidad de veces que va a hacer el blik (prender y apagar), el intervalo que indica
   * cuanto tiempo demora el blink y el array de leds.
   */
  unsigned int contador = 0;

  while (contador <= cantRep - 1) {
    unsigned long currentMillis = millis();
    static unsigned long previousMillis = 0;
    static int ledState = LOW;

    if (currentMillis - previousMillis >= interval) {
      previousMillis = currentMillis;

      if (ledState == LOW) {
        ledState = HIGH;
      } else {
        ledState = LOW;
        contador++;
      }

      for (int i = 0; i < 4; i++) {
        digitalWrite(LEDPinArray[i], ledState);
      }
    }
  }
}

// **************************************************** Imprimir tiempo ****************************************************
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

// ************************************* funcion para testear botones *************************************
/* void inout() {
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
} */

void resetAll() {
  setInitGame(false);
  indiceActual = 0;
  indiceToSecuenciaDeReaccion = 0;
  startTime = 0;
  startTime2 = 0;
  startGame = true;
}

// ******************************************************** Game 2 ********************************************************
void game(const byte *LEDPinArray, const byte *BUTTONPinArray) {
  // ********************************************** si se recibe la secuencia **********************************************
  if (getInitGame()) {
    if (startGame) {
      // *********************************** Ejecuta el blink 4 veces antes de comenzar ***********************************
      blink(4, 1000, LEDPinArray);
      startGame = false;
    }
    unsigned long currentTime = millis();

    // ******************** Si el indice actual llega al final de la secuencia o el resto están vacias ********************
    if (indiceActual >= 10 || getSecuenceMatrix(indiceActual, 0) == "") {
      blink(2, 1000, LEDPinArray);
      Serial.println("Game over");
      resetAll();
      return;
      // if (isDeviceConnected()) {
      //   sendData("1");
      // }
    }

    // *************** Si el tiempo actual menos el tiempo de inicio es mayor o igual al tiempo en segundos ***************
    if (startTime != 0 && currentTime - startTime >= getSecuenceMatrix(indiceActual, 1).toInt()) {
      digitalWrite(LEDPinArray[getSecuenceMatrix(indiceActual, 0).toInt()], LOW);  // Apagar el LED actual
      buttonpressed = 0;

      indiceActual++;  // Cambiar al siguiente LED

      // **************************************** si la secuencia actual está vacia ****************************************
      if (getSecuenceMatrix(indiceActual, 0) == "") {
        return;
      }

      digitalWrite(LEDPinArray[getSecuenceMatrix(indiceActual, 0).toInt()], HIGH);  // Encender el siguiente LED
      startTime = currentTime;

      // ************************************************ primera ejecución ************************************************
    } else if (startTime == 0) {
      digitalWrite(LEDPinArray[getSecuenceMatrix(indiceActual, 0).toInt()], HIGH);  // Encender el primer LED
      startTime = currentTime;
    }

    if (currentTime - startTime2 >= 1000) {
      printTime(currentTime, indiceActual);
      startTime2 = currentTime;
    }

    // ********************************** imprime el tiempo de la secuencia cada segundo **********************************
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