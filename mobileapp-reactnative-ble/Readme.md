# Mobile App - React Native - BLE

## 1. Install dependencies

(El path no debe ser muy largo, porque genera error)

```bash
npx create-expo-app -t expo-template-blank-typescript expo-ble-sample
cd .\expo-ble-sample\

npx expo install react-native-ble-plx \
    @config-plugins/react-native-ble-plx \
    expo-device \
    react-native-base64 \
    @shopify/react-native-skia \
    expo-dev-client
```

## 2. EAS client

Create eas.json file

```json
{
    "build": {
        "development": {
            "developmentClient": true,
            "distribution": "internal"
        },
        "preview": {
            "distribution": "internal"
        },
        "production": {}
    }
}
```

And exect

```bash
npx npm install eas-cli
```

Configurar app.jsonm
Agregar, el siguiente bloque en "expo"

```json
"plugins": [
 [
   "@config-plugins/react-native-ble-plx",
   {
     "isBackgroundEnabled": true,
     "modes": [
       "peripheral",
       "central"
      ],
     "bluetoothAlwaysPermission": "Allow $(PRODUCT_NAME) to connect to bluetooth devices"
   }
 ]
],
```

y permission en "android"

```json
"permissions": [
    "android.permission.BLUETOOTH",
    "android.permission.BLUETOOTH_ADMIN",
    "android.permission.BLUETOOTH_CONNECT"
],
"package": "com.anonymous.expoblesample"
```

## 3. Prebuild

```bash
npm install --save-dev sharp-cli
npx expo prebuild
```

## 4. Running

```bash
npx expo run:android
```
