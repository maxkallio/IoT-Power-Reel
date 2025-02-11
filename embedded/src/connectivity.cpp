#include "connectivity.h"

// Password and SSID for the Wifi.
#if defined(SSID_NAME) && defined(SSID_PASSWORD)
#else
  #define SSID_NAME "iotroam"
  #define SSID_PASSWORD "amqikyA95C"
#endif

void WiFiSetup() {

    int attemptCount = 0;

    WiFi.begin(SSID_NAME, SSID_PASSWORD);

    while (WiFi.status() != WL_CONNECTED && attemptCount < 4) {
      delay(1000);
      Serial.println("Connecting to WiFi...");
      attemptCount++;
    }

    if (WiFi.status() == WL_CONNECTED) {
      Serial.println("Connected to the WiFi network");
    } else {
      Serial.println("Failed to connect to WiFi after 4 attempts");
    }
}