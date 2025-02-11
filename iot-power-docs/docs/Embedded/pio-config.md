# PlatformIO Configuration

This explains how to configure and use PlatformIO for multi-board compatibility, here for both the **D1 Mini Lite** (ESP8266) and the **ESP32 Devkit V1**.


The `platformio.ini` file defines environments for the D1 Mini Lite and ESP32 boards. Each environment includes board-specific settings, build flags, and library dependencies.

#### Configuration File:
```ini
[env:d1_mini_lite]
platform = espressif8266
board = d1_mini_lite
framework = arduino
build_flags = -DD1_MINI
lib_deps = 
    miguelbalboa/MFRC522@^1.4.11
    marcoschwartz/LiquidCrystal_I2C@^1.1.4
    bblanchon/ArduinoJson@^7.2.1

[env:esp32doit-devkit-v1]
platform = espressif32
board = esp32doit-devkit-v1
framework = arduino
monitor_speed = 115200
build_flags = -DESP_32
lib_deps = 
    miguelbalboa/MFRC522@^1.4.11
    marcoschwartz/LiquidCrystal_I2C@^1.1.4
    bblanchon/ArduinoJson@^7.2.1
```

The important thing here are the build flags, which are used to add specific macros according to the selected board :
  - `-DD1_MINI`: Defines `D1_MINI` for the ESP8266 environment.  
  - `-DESP_32`: Defines `ESP_32` for the ESP32 environment.  

---

### Example header for compatibility for both boards

This example header file provides board-specific includes and declarations, for connectivity functionality. 

```cpp
#ifndef EMBEDDED_CONNECTIVITY_H
#define EMBEDDED_CONNECTIVITY_H

#if defined(D1_MINI)
    #include <ESP8266WiFi.h>
    #include <ESP8266HTTPClient.h>
#elif defined(ESP_32)
    #include <WiFi.h>
    #include <HTTPClient.h>
#else
    #error "Please define a valid board (D1_MINI or ESP32)"
#endif

#include <WiFiClient.h>
#include <ArduinoJson.h>

void WiFiSetup();
String getLockerNumber();

#endif //EMBEDDED_CONNECTIVITY_H
```
---

To compile and upload the code for a specific board, select the appropriate environment in PlatformIO :
```bash
# Compile and upload for D1 Mini Lite
pio run --environment d1_mini_lite --target upload

# Compile and upload for ESP32 Devkit V1
pio run --environment esp32doit-devkit-v1 --target upload
```


### **Further references**
- PlatformIO documentation: [https://docs.platformio.org/](https://docs.platformio.org/)  
- Arduino reference: [https://www.arduino.cc/reference/en/](https://www.arduino.cc/reference/en/)  
- Libraries:  
  - [MFRC522](https://platformio.org/lib/show/161/MFRC522)  
  - [LiquidCrystal_I2C](https://platformio.org/lib/show/576/LiquidCrystal_I2C)  
  - [ArduinoJson](https://platformio.org/lib/show/64/ArduinoJson)
