#ifndef Game_h
#define Game_h

#include <Arduino.h>

void blink(int, long, const byte*);
void printTime(long, int);
void resetAll();
void game(const byte*, const byte*);
// Get
bool getInitGame();
int getMaxPairs();
String getSecuenceMatrix(int, int);
String getSecuenciaDeReaccion(int, int);
String getRespuesta();
String getSecuenciaString();
// Set
void setInitGame(bool);
void setRespuesta(String);
void pushToMatrix(int, String, String);
void pushToSecuenciaDeReaccion(int, String, String);
void setSecuenceMatrix(String);

#endif