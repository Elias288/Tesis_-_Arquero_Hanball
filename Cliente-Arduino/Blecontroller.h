#ifndef Blecontroller_h
#define Blecontroller_h

#include <Arduino.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

void initBLE();
void connectBLE(const byte*, const byte*);
void sendData(std::vector<std::string>);
void sendData(int);
void unpackMSG(std::string);
void packMSG(std::string &, std::vector<std::string> &);
void redirectMSG(String);
bool isDeviceConnected();
bool isOldDeviceConnected();
// Get
std::string getReceivedMsg();
// Set

#endif