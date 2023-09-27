#ifndef Blecontroller_h
#define Blecontroller_h

#include <Arduino.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

void initBLE();
void connectBLE();
void sendData(std::string);
void sendData(int);
void unpackMSG(std::string);
void redirectMSG(std::string);
bool isDeviceConnected();
bool isOldDeviceConnected();
bool getInitGame();
void setInitGame(bool);
int** getSecuenceMatrix();
void setSecuenceMatrix(std::string);
int getCantComps();
std::string getReceivedMsg();

#endif