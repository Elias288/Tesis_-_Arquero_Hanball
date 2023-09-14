/* 
* Necesitamos configurar la placa ESP32 como servidor BLE que reciba una secuencia, ejecute el
* el juego y envie una respuesta hacia el celular.
*/

#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

#define LED_1 19
#define LED_2 18
#define LED_3 5
#define LED_4 17

#define BUTTON_1 34
#define BUTTON_2 35
#define BUTTON_3 32
#define BUTTON_4 25

#define bleServerName "ESP32-Server"

// **************************************** Cantidad de componentes ****************************************
#define CANT_COMPS 4

// ******************************************** Init BLE Server ********************************************
BLEServer *pServer;
BLEService *pService;
BLECharacteristic *pCharacteristic;

// BLECharacteristic *pCharacteristic;
bool deviceConnected = false;
bool oldDeviceConnected = false;
uint32_t value = 0;
// float txValue = 0;

// bool convert = false;
// String rxString = "";
// std::string rxValue;  // rxValue gathers input data

// ***************************************** UART service UUID data *****************************************
#define SERVICE_UUID "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"

const byte LEDPinArray[CANT_COMPS] = {
  LED_1,
  LED_2,
  LED_3,
  LED_4
};
const byte BUTTONPinArray[CANT_COMPS] = {
  BUTTON_1,
  BUTTON_2,
  BUTTON_3,
  BUTTON_4
};

// ********************************* matriz con orden y tiempos de cada uno *********************************
const int secuenceMatrix[][2] = {
  { 0, 2000 },  // LED_1
  { 1, 3000 },  // LED_2
  { 2, 4000 },  // LED_3
  { 3, 5000 },  // LED_4
  { 0, 4000 },  // LED_1
  { 1, 1000 },  // LED_2
};
int secuenciaDeReaccion[][2] = {};
// **********************************************************************************************************

void initComponents() {
  for (int i = 0; i < CANT_COMPS; i++) {
    pinMode(LEDPinArray[i], OUTPUT);
    pinMode(BUTTONPinArray[i], INPUT);
  }
}

class MyServerCallbacks : public BLEServerCallbacks {
  void onConnect(BLEServer *pServer) {
    deviceConnected = true;
  };

  void onDisconnect(BLEServer *pServer) {
    deviceConnected = false;
  }
};

void initBLE() {

  // Create the BLE Device
  BLEDevice::init(bleServerName);

  // // Create the BLE Server
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  // Create the BLE Service
  BLEService *pService = pServer->createService(SERVICE_UUID);

  // Create a BLE Characteristic
  pCharacteristic = pService->createCharacteristic(
    CHARACTERISTIC_UUID,
    BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE | BLECharacteristic::PROPERTY_NOTIFY | BLECharacteristic::PROPERTY_INDICATE);

  // // https://www.bluetooth.com/specifications/gatt/viewer?attributeXmlFile=org.bluetooth.descriptor.gatt.client_characteristic_configuration.xml
  // // Create a BLE Descriptor
  pCharacteristic->addDescriptor(new BLE2902());

  // pCharacteristic->setValue("Hello, World!");

  // Start the service
  pService->start();

  // Start advertising
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x0);  // set value to 0x00 to not advertise this parameter
  BLEDevice::startAdvertising();
}

void setup() {
  Serial.begin(115200);

  initBLE();
  initComponents();
}

// ******************************************** Imprimir tiempo ********************************************
unsigned long startTime2 = 0;
void printTime(long currentTime, int indiceActual) {
  Serial.print("Led: [");
  Serial.print(secuenceMatrix[indiceActual][0] + 1);
  Serial.print("][");
  Serial.print(secuenceMatrix[indiceActual][1]);
  Serial.print("] - ");
  Serial.println((float)currentTime / 1000);
  startTime2 = currentTime;
}
// *********************************************************************************************************

// ************************************ funcion que parpadea las luces ************************************
void blink() {
  for (int i = 0; i < CANT_COMPS; i++) {
    digitalWrite(LEDPinArray[i], HIGH);
  }
  delay(1000);

  for (int i = 0; i < CANT_COMPS; i++) {
    digitalWrite(LEDPinArray[i], LOW);
  }
  delay(1000);
}

// ************************************* funcion para testear botones *************************************
void inout() {
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
}
// *********************************************************************************************************

// ************************************** Crea la lista de resultados **************************************
int indiceSecuencia = 0;
void pushToSecuenciaDeReaccion(int led, long time) {
  secuenciaDeReaccion[indiceSecuencia][0] = led;
  secuenciaDeReaccion[indiceSecuencia][1] = time;

  Serial.print(indiceSecuencia);
  Serial.print("- led: ");
  Serial.print(led);
  Serial.print("- time: ");
  Serial.println(time);

  indiceSecuencia++;
}
// *********************************************************************************************************

// ***************************************** Enviar datos por BLE *****************************************
void sendData(int txValue) {
  //--- Envio de Datos -----------------------------
  //--- Conversion de txValue ----------------------
  char txString[10];
  sprintf(txString, "%4.4f", txValue);
  // dtostrf(txValue,1,2, txString);

  //--- Set Valor ----------------------------------
  pCharacteristic->setValue(txString);

  //--- Notifying the client -----------------------
  pCharacteristic->notify();

  //--- Valor enviado ------------------------------
  Serial.println("Sent value: " + String(txString));
}
// *********************************************************************************************************

// ******************************************* Función Principal *******************************************
int indiceActual = 0;  // posicion de la lista de secuencia
bool gameRun = false;  // indicador de juego ejecutandose
bool startGame = true;
int blinkCount = 2;
int buttonpressed = 0;        // indicador de boton pulsao
unsigned long startTime = 0;  // tiempo de inicio
void game() {
  if (startGame) {
    blink();
    blinkCount = blinkCount - 1;

    if (blinkCount == 0) {
      startGame = false;
      gameRun = true;
    }
  }
  if (gameRun) {
    unsigned long currentTime = millis();

    // si el indice actual llega al final de la secuencia
    if (indiceActual >= (sizeof(secuenceMatrix) / sizeof(secuenceMatrix[0]))) {
      gameRun = false;
      Serial.println("Game over");
      if (deviceConnected) {
        sendData(1);
      }
    }

    // si el tiempo actual menos el tiempo de inicio es mayor o igual al tiempo en segundos
    if (startTime != 0 && currentTime - startTime >= secuenceMatrix[indiceActual][1]) {
      digitalWrite(LEDPinArray[secuenceMatrix[indiceActual][0]], LOW);  // Apagar el LED actual
      buttonpressed = 0;

      indiceActual = (indiceActual + 1);  // Cambiar al siguiente LED

      digitalWrite(LEDPinArray[secuenceMatrix[indiceActual][0]], HIGH);  // Encender el siguiente LED
      startTime = currentTime;
    } else if (startTime == 0) {
      digitalWrite(LEDPinArray[secuenceMatrix[indiceActual][0]], HIGH);  // Encender el primer LED
      startTime = currentTime;
    }

    if (currentTime - startTime2 >= secuenceMatrix[indiceActual][1]) {
      printTime(currentTime, indiceActual);
      startTime2 = currentTime;
    }

    // imprime el tiempo de reaccion
    if (digitalRead(BUTTONPinArray[secuenceMatrix[indiceActual][0]]) == HIGH && buttonpressed == 0) {
      unsigned long buttonPressTime = currentTime - startTime;
      Serial.print("Tiempo de reacción: ");
      Serial.print(((float)buttonPressTime / 1000));
      Serial.println("s");
      buttonpressed = 1;

      pushToSecuenciaDeReaccion(secuenceMatrix[indiceActual][0], buttonPressTime);
    }
  }
}
// *********************************************************************************************************

void connectBLE() {
  if (deviceConnected) {
    pCharacteristic->setValue((uint8_t *)&value, 4);
    pCharacteristic->notify();
    value++;
    delay(3);  // bluetooth stack will go into congestion, if too many packets are sent, in 6 hours test i was able to go as low as 3ms
  }
  // disconnecting
  if (!deviceConnected && oldDeviceConnected) {
    delay(500);                   // give the bluetooth stack the chance to get things ready
    pServer->startAdvertising();  // restart advertising
    Serial.println("start advertising");
    oldDeviceConnected = deviceConnected;
  }
  // connecting
  if (deviceConnected && !oldDeviceConnected) {
    // do stuff here on connecting
    oldDeviceConnected = deviceConnected;
  }
}

void loop() {
  // game();
  // blink();
  connectBLE();
  // inout();
}
