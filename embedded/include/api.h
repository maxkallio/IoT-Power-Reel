#ifndef EMBEDDED_API_H
#define EMBEDDED_API_H

#include <ArduinoJson.h>

#if defined(D1_MINI)
    #include <ESP8266HTTPClient.h>
#elif defined(ESP_32)
    #include <HTTPClient.h>
#else
    #error "Please define a valid board (D1_MINI or ESP32)"
#endif

String getLockerNumberWithTransaction(String userId);
String getTransactionType(String userId);
void revertTransaction(String revertType, String lockerId, String userId);
String checkForReservation(String userId);
String retrieveReservation(String reservationId);
String getUserIdWithUID(String uid);

#endif //EMBEDDED_API_H