#ifndef EMBEDDED_CONNECTIVITY_H
#define EMBEDDED_CONNECTIVITY_H

#if defined(D1_MINI)
    #include <ESP8266WiFi.h>
#elif defined(ESP_32)
    #include <WiFi.h>
#else
    #error "Please define a valid board (D1_MINI or ESP32)"
#endif

void WiFiSetup();

#endif //EMBEDDED_CONNECTIVITY_H