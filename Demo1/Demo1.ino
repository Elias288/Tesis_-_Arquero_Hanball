#include <Vector.h>

int PINLED1 = 12;
int PINLED2 = 13;
int ENTRADA1 = 4;
int ENTRADA2 = 5;

int ledPines[] = {12, 13};
int botonPines[] = {4, 5};

Vector<int> ordenPulsado;

int indiceActual = 0;  // Índice del LED actualmente encendido
int contadorPulsaciones = 0; 

bool pushedBtn1 = false, pushedBtn2 = false;

void setup() {
  pinMode(PINLED1, OUTPUT);
  pinMode(ENTRADA1, INPUT);
  pinMode(PINLED2, OUTPUT);
  pinMode(ENTRADA2, INPUT);

  Serial.begin(9600);
}

// template <size_t n> void push(int (&arr)[n], int const value) {
//   static size_t index = 0;

//   arr[index] = value;
//   index = (index + 1) % n;
// }

void loop() {

  // Verificar si se ha pulsado el botón correspondiente al LED actual
  if (digitalRead(botonPines[indiceActual]) == true) {
    // Apagar el LED actual
    digitalWrite(ledPines[indiceActual], LOW);
    // Pasar al siguiente LED en el array
    indiceActual++;

    // Verificar si se alcanzó el final del array
    if (indiceActual >= sizeof(ledPines) / sizeof(ledPines[0])) {
      // Reiniciar al principio del array
      indiceActual = -1;
    }
  }

  if (digitalRead(botonPines[0]) == true){
    if (pushedBtn1 == false){
      Serial.println("Push 4");
      ordenPulsado.push_back(4);
      pushedBtn1 = true;
    }
  }
  else if(digitalRead(botonPines[0]) == false){
    pushedBtn1 = false;
  }

  if (digitalRead(botonPines[1]) == true){
    if (pushedBtn2 == false){
      Serial.println("Push 5");
      ordenPulsado.push_back(5);
      pushedBtn2 = true;
    } 
  }
  else if(digitalRead(botonPines[0]) == false){
    pushedBtn2 = false;
  }

  // Encender el LED actual
  digitalWrite(ledPines[indiceActual], HIGH);

  if (indiceActual == -1){
    for (int element : ordenPulsado) {
      Serial.println(element);
    }
    indiceActual = -2;
  }
}
