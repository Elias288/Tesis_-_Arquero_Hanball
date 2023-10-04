#include "Game.h"

int indiceActual = 0;          // posicion de la lista de secuencia
int buttonpressed = 0;         // indicador de boton pulsao
bool startGame = true;         // inicia el blink inicial del juego
unsigned long startTime = 0;   // tiempo de inicio
unsigned long startTime2 = 0;  // tiempo para mostrar en serial
int indiceToSecuenciaDeReaccion = 0;
const int maxPairs = 10;
bool initGame = false;
String matrix[maxPairs][2];
String secuenciaDeReaccion[maxPairs][2];

bool getInitGame() {
  return initGame;
}

int getMaxPairs() {
  return maxPairs;
}

void setInitGame(bool val) {
  initGame = val;
}

String getSecuenceMatrix(int fila, int columna) {
  if (fila >= 0 && fila < 10 && columna >= 0 && columna < 2) {
    return matrix[fila][columna];
  } else {
    return "";  // Devolver una cadena vacía si las coordenadas están fuera de rango
  }
}

void pushToMatrix(int indiceSecuencia, String led, String time) {
  matrix[indiceSecuencia][0] = led;
  matrix[indiceSecuencia][1] = time;
}

void pushToSecuenciaDeReaccion(int indiceSecuencia, String led, String time) {
  secuenciaDeReaccion[indiceSecuencia][0] = led;
  secuenciaDeReaccion[indiceSecuencia][1] = time;
}

void setSecuenceMatrix(String input) {
  int pairIndex = 0;
  String pair = "";

  // Recorrer la cadena
  for (int i = 0; i < input.length(); i++) {
    char c = input.charAt(i);

    if (c == ';') {
      // Se encontró un separador ';', dividir la subcadena en "led" y "time"
      int commaIndex = pair.indexOf(',');
      if (commaIndex != -1) {
        String ledStr = pair.substring(0, commaIndex);
        String timeStr = pair.substring(commaIndex + 1);

        // Convertir las cadenas a enteros y almacenar en la matriz
        matrix[pairIndex][0] = ledStr;
        matrix[pairIndex][1] = timeStr;

        /* Serial.print(pairIndex);
        Serial.print("= ");
        Serial.print(ledStr);
        Serial.print(": ");
        Serial.println(timeStr); */
        pairIndex++;
      }
      pair = "";  // Restablecer la subcadena
    } else {
      pair += c;  // Agregar caracteres a la subcadena
    }
  }
}

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