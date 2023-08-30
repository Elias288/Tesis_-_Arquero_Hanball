// ***************************** BLE DECLARE *******************************
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

BLECharacteristic *pCharacteristic;
bool deviceConnected = false;
float txValue = 0;
//const int button = 0;      // button on PIN G0
//const int readPin = 32;    // analog pin G32
//const int LEDpin = 2;      // LED on pin G2
bool convert = false;
String rxString = "";
std::string rxValue;       // rxValue gathers input data

// UART service UUID data
#define SERVICE_UUID           "6E400001-B5A3-F393-E0A9-E50E24DCCA9E" 
#define CHARACTERISTIC_UUID_RX "6E400002-B5A3-F393-E0A9-E50E24DCCA9E"
#define CHARACTERISTIC_UUID_TX "6E400003-B5A3-F393-E0A9-E50E24DCCA9E"

class MyServerCallbacks: public BLEServerCallbacks {
  void onConnect(BLEServer* pServer) {
    deviceConnected = true;
  };
  void onDisconnect(BLEServer* pServer) {
    deviceConnected = false;
  }
};

class MyCallbacks: public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic *pCharacteristic) {
    std::string rxValue = pCharacteristic->getValue();
    if (rxValue.length() > 0)  {
      convert = true;      // flag to invoke convertControlpad routine
      Serial.println(" ");
      Serial.print("Received data: ");
      for (int i = 0; i < rxValue.length(); i++) { 
        Serial.print(rxValue[i]);
        rxString = rxString + rxValue[i]; // build string from received data 
      } 
    } 
  } 
}; 

// ***************************** GAME DECLARE *******************************

#define LED_1 21
#define LED_2 19
#define LED_3 18
#define LED_4 5

#define BUTTON_1 34
#define BUTTON_2 35
#define BUTTON_3 32
#define BUTTON_4 33

// cantidad de componentes a utilizar, 4 leds, 4 botones
#define CANT_COMPS 4

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

void initComponents() {
  for (int i = 0; i < CANT_COMPS; i++) {
    pinMode(LEDPinArray[i], OUTPUT);
    pinMode(BUTTONPinArray[i], INPUT);
  }
}

// ***************************** SETUP *******************************
void setup() { 
  // ***************************** GAME SETUP *******************************
  initComponents();
  Serial.begin(9600);
  // ***************************** BLE SETUP *******************************
  //Serial.begin(115200); 
  pinMode(LEDpin, OUTPUT); 
  pinMode(button, INPUT);
  
  BLEDevice::init("DEAH ESP32 UART"); // give the BLE device a name
  
  BLEServer *pServer = BLEDevice::createServer(); // create BLE server
  pServer->setCallbacks(new MyServerCallbacks());

  // Create the BLE Service
  BLEService *pService = pServer->createService(SERVICE_UUID);

  // Create a BLE Characteristic
  pCharacteristic = pService->createCharacteristic(
                      CHARACTERISTIC_UUID_TX,
                      BLECharacteristic::PROPERTY_NOTIFY);                    
  pCharacteristic->addDescriptor(new BLE2902());
  BLECharacteristic *pCharacteristic = pService->createCharacteristic(
                                         CHARACTERISTIC_UUID_RX,
                                         BLECharacteristic::PROPERTY_WRITE);
  pCharacteristic->setCallbacks(new MyCallbacks());
  
  pService->start(); // start the service

  pServer->getAdvertising()->start(); // start advertising
  Serial.println("Waiting a client connection to notify...");
  Serial.println(" ");
}

// matriz con orden y tiempos de cada uno
const int secuenceMatrix[][2] = {
  { 1, 500 },
  { 3, 1000 },
  { 0, 2000 },
  { 2, 500 },
  { 1, 4000 },
  { 2, 1000 },
};
// matriz con tiempos de reaccion
int reaccionMatrix[][2] = {
  { 1, 500 },
  { 3, 1000 },
  { 0, 2000 },
  { 2, 500 },
  { 1, 4000 },
  { 2, 1000 },
};

int indiceActual = 0;        // posicion de la lista de secuencia
bool gameRun = true;          // indicador de juego ejecutandose
int buttonpressed = 0;        // indicador de boton pulsao
unsigned long startTime = 0;  // tiempo de inicio
unsigned long startTime2 = 0;

void printTime(long currentTime) {
  Serial.print("Led: [");
  Serial.print(secuenceMatrix[indiceActual][0] + 1);
  Serial.print("][");
  Serial.print(secuenceMatrix[indiceActual][1]);
  Serial.print("] - ");
  Serial.println((float)currentTime / 1000);
  startTime2 = currentTime;
}


// *************************** GAME PROGRAM *********************************
void game() {
  
  if (gameRun) {
    unsigned long currentTime = millis();

    // si el indice actual llega al final de la secuencia
    if (indiceActual >= (sizeof(secuenceMatrix) / sizeof(secuenceMatrix[0]))) {
      gameRun = false;
      Serial.println("Game over");
    }

    // si el tiempo actual menos el tiempo de inicio es mayor o igual al tiempo en segundos
    if ( startTime != 0 && currentTime - startTime >= secuenceMatrix[indiceActual][1]) {
      digitalWrite(LEDPinArray[secuenceMatrix[indiceActual][0]], LOW);  // Apagar el LED actual
      buttonpressed = 0;

      indiceActual = (indiceActual + 1); // Cambiar al siguiente LED

      digitalWrite(LEDPinArray[secuenceMatrix[indiceActual][0]], HIGH);  // Encender el siguiente LED
      startTime = currentTime;

    } else if (startTime == 0 ) {
      digitalWrite(LEDPinArray[secuenceMatrix[indiceActual][0]], HIGH);  // Encender el primer LED
      startTime = currentTime;
    }

    if (currentTime - startTime2 >= secuenceMatrix[indiceActual][1]) {
      printTime(currentTime);
      startTime2 = currentTime;
    }

    // imprime el tiempo de reaccion
    // if (digitalRead(BUTTONPinArray[secuenceMatrix[indiceActual][0]]) == HIGH && buttonpressed == 0) {
    //   unsigned long buttonPressTime = currentTime - startTime;
    //   Serial.print("Tiempo de reacción: ");
    //   Serial.print(((float)buttonPressTime / 1000));
    //   Serial.println("s");
    //   buttonpressed = 1;
    // }
    if (true) {// ESTO SOLO LO MUESTRA AL FINALIZAR TODOS LOS LEDS Y buttonPressTime ES 00
          reaccionMatrix[indiceActual][0] = (currentTime - startTime) / 1000;
          //unsigned long buttonPressTime = (currentTime - startTime);
          Serial.print("Tiempo de reacción: ");
          float prueba = (float)reaccionMatrix[indiceActual][0] ;
          Serial.print(prueba);
          Serial.println("s");

          float reaccion = currentTime - startTime;

          Serial.print("Coso: ");
          Serial.print(reaccion);
          Serial.println("s");

          //Serial.print(((float)buttonPressTime / 1000));
          buttonpressed = 1;
    }
    // if(gamerun == false && deviceConnected) {//--- Si celular conectado--------
            
            
            
    //         //--- Envio de Datos -----------------------------
    //         txValue = prueba;
    //         // Serial.print(txValue);

    //         //--- Conversion de txValue ----------------------
    //         char txString[10];
    //         sprintf(txString,"%4.4f",txValue);
    //         //dtostrf(txValue,1,2, txString);

    //         //--- Set Valor ----------------------------------
    //         pCharacteristic->setValue(txString); 

    //         //--- Notifying the client -----------------------
    //         pCharacteristic->notify();

    //         //--- Valor enviado ------------------------------
    //         Serial.println("Sent value: "+ String(txString));
    //         delay(500);
    //       }
  }
}

void buttonPessedISR() {
  buttonpressed = true;
}

// *************************** MAIN PROGRAM *********************************
void loop() {
  delay(5000);
  game();
}

// if (deviceConnected) {
//     txValue = analogRead(readPin);        // pick up value on readPin
//     char txString[8];                     // convert the value to a char array
//     dtostrf(txValue, 1, 2, txString); // float_val, min_width, decimal_digits, char_buffer   
// //    pCharacteristic->setValue(&txValue, 1); // to send the integer value
// //    pCharacteristic->setValue("Hello!");    // to send a test message
//     pCharacteristic->setValue(txString);  // prepare to send array
//     if (digitalRead(button) == LOW) {     // send when button is pressed
//       pCharacteristic->notify();          // send the value to the app!
//       pCharacteristic->setValue(" ");     // send a space
//       pCharacteristic->notify();
//       digitalWrite(LEDpin, HIGH);         // switch on the LED
//       Serial.println(" ");
//       Serial.print("*** Peripheral sends: "); 
//       Serial.print(txString);             // report value on serial line
//       Serial.println(" ***");
//     }
//     else digitalWrite(LEDpin, LOW);
//     if (convert) convertControlpad();
//   }
//   delay(50);




