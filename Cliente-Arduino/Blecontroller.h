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

#endif