#include "Blecontroller.h"

#define SERVICE_UUID "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID "00002a37-0000-1000-8000-00805f9b34fb"

#define bleServerName "ESP32-server v2"

const int MAX_MESSAGE_SIZE = 512;
char receivedMessage[MAX_MESSAGE_SIZE];
int messageIndex = 0;
BLEServer *pServer = NULL;
BLECharacteristic *pCharacteristic = NULL;
bool deviceConnected = false;
bool oldDeviceConnected = false;
uint32_t value = 0;


class MyServerCallbacks : public BLEServerCallbacks {
  void onConnect(BLEServer *pServer) {
    deviceConnected = true;
  };

  void onDisconnect(BLEServer *pServer) {
    deviceConnected = false;
    memset(receivedMessage, 0, sizeof(receivedMessage));
    Serial.println("Client desconected");
  };
};

class MyCaracteristicCallbacks : public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic *characteristics) {
    std::string valueBase64 = characteristics->getValue();
    String value = valueBase64.c_str();

    for (size_t i = 0; i < value.length(); i++) {
      char receivedChar = value[i];

      if (receivedChar == '\n') {
        // Procesar el mensaje completo
        receivedMessage[messageIndex] = '\0';  // Agregar terminador nulo
        Serial.println(receivedMessage);

        // Reiniciar el índice del mensaje
        messageIndex = 0;
      } else {
        // Almacenar el carácter en el buffer del mensaje
        if (messageIndex < MAX_MESSAGE_SIZE - 1) {
          receivedMessage[messageIndex++] = receivedChar;
        }
      }
    }
  }
};

void initBLE() {
  // Create the BLE Device
  BLEDevice::init(bleServerName);

  // Create the BLE Server
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  // Create the BLE Service
  BLEService *pService = pServer->createService(SERVICE_UUID);

  // Create a BLE Characteristic
  pCharacteristic = pService->createCharacteristic(
    CHARACTERISTIC_UUID,
    BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE | BLECharacteristic::PROPERTY_NOTIFY | BLECharacteristic::PROPERTY_INDICATE);

  // https://www.bluetooth.com/specifications/gatt/viewer?attributeXmlFile=org.bluetooth.descriptor.gatt.client_characteristic_configuration.xml
  // Create a BLE Descriptor
  pCharacteristic->addDescriptor(new BLE2902());
  pCharacteristic->setCallbacks(new MyCaracteristicCallbacks());

  // Start the service
  pService->start();

  // Start advertising
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(false);
  pAdvertising->setMinPreferred(0x0);  // set value to 0x00 to not advertise this parameter
  BLEDevice::startAdvertising();

  Serial.println("Waiting a client connection to notify...");
}

void connectBLE() {
  // notify changed value
  if (deviceConnected) {
    sendData("saludo desde ESP32");
    delay(5000);  // bluetooth stack will go into congestion, if too many packets are sent, in 6 hours test i was able to go as low as 3ms
  }
  // disconnecting
  if (!deviceConnected && oldDeviceConnected) {
    delay(500);                   // give the bluetooth stack the chance to get things ready
    pServer->startAdvertising();  // restart advertising
    // Serial.println("start advertising");
    oldDeviceConnected = deviceConnected;
  }
  // connecting
  if (deviceConnected && !oldDeviceConnected) {
    // do stuff here on connecting
    oldDeviceConnected = deviceConnected;
    Serial.println("client connected");
  }
}

void sendData(std::string txValue) {
  pCharacteristic->setValue(txValue);
  pCharacteristic->notify();
}