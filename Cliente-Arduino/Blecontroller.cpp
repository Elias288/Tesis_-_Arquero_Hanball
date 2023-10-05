#include "Blecontroller.h"
#include "Game.h"

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
  }

  void onDisconnect(BLEServer *pServer) {
    deviceConnected = false;
    memset(receivedMessage, 0, sizeof(receivedMessage));
    Serial.println("Client desconected");
  }
};

class MyCaracteristicCallbacks : public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic *characteristics) {
    std::string valueBase64 = characteristics->getValue();
    unpackMSG(valueBase64.c_str());
  }
};

// ************************************************** Getters **************************************************
bool isDeviceConnected() {
  return deviceConnected;
}

bool isOldDeviceConnected() {
  return oldDeviceConnected;
}

std::string getReceivedMsg() {
  return receivedMessage;
}

// ************************************* Redirige el mensaje segun su tipo *************************************
void redirectMSG(String inMsg) {
  /*
   * FORMATO DE MENSAJE RECIBIDO
   * funcion1:content1\tfuncion2:content2\t...\n
   */
  char *token;
  char *strtokIndx;
  char *function;
  char *content;

  token = strtok_r((char *)inMsg.c_str(), "\t", &strtokIndx);
  while (token != NULL) {
    // Dividir el par "funcion: contenido" en función y contenido
    function = strtok(token, ":");
    content = strtok(NULL, ":");

    if (function != NULL && content != NULL) {
      if (strcmp(function, "secuence") == 0) {
        Serial.print("Secuencia: ");
        Serial.println(content);

        // Inicializar la matriz
        for (int i = 0; i < getMaxPairs(); i++) {
          pushToMatrix(i, "", "");
        }
        for (int i = 0; i < getMaxPairs(); i++) {
          pushToSecuenciaDeReaccion(i, "", "");
        }

        String stringContent = String(content);
        setSecuenceMatrix(stringContent);

        setInitGame(true);
        return;
      }
      if (strcmp(function, "startGame") == 0) {
        Serial.println("startGame");
        return;
      }
      if (strcmp(function, "inMsg") == 0 || strcmp(function, "") == 0) {
        Serial.print("inMsg: ");
        Serial.println(content);
        return;
      }
    }

    token = strtok_r(NULL, "\t", &strtokIndx);
  }
}

// **************************************** obtiene la cadena de mensaje ****************************************
void unpackMSG(std::string inMsg) {
  for (size_t i = 0; i < inMsg.length(); i++) {
    char receivedChar = inMsg[i];

    if (receivedChar == '\n') {
      // Procesar el mensaje completo
      receivedMessage[messageIndex] = '\0';  // Agregar terminador nulo
      redirectMSG(receivedMessage);
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

// ***************************************** Inicializa el servidor BLE *****************************************
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

// ***************************************** Funcion de conexión (loop) *****************************************
int cantMsgSend = 1;
void connectBLE(const byte *LEDPinArray, const byte *BUTTONPinArray) {
  // notify changed value
  if (deviceConnected) {
    if (cantMsgSend >= 1) {
      sendData("saludo:desde ESP32");
      cantMsgSend--;
    }

    game(LEDPinArray, BUTTONPinArray);

    if (getRespuesta() != "") {
      String res = "res:";
      res += getRespuesta();

      Serial.println(res);
      sendData(res.c_str());

      setRespuesta("");
    }
  }
  // disconnecting
  if (!deviceConnected && oldDeviceConnected) {
    delay(500);                   // give the bluetooth stack the chance to get things ready
    pServer->startAdvertising();  // restart advertising
    // Serial.println("start advertising");
    oldDeviceConnected = deviceConnected;
    cantMsgSend = 1;
  }
  // connecting
  if (deviceConnected && !oldDeviceConnected) {
    // do stuff here on connecting
    oldDeviceConnected = deviceConnected;
    Serial.println("client connected");
  }
}

// ******************************************* Enviar data al cliente *******************************************
void sendData(std::string txValue) {
  pCharacteristic->setValue(txValue);
  pCharacteristic->notify();
}