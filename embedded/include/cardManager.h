#ifndef EMBEDDED_CARDMANAGER_H
#define EMBEDDED_CARDMANAGER_H

#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN 15
#define RST_PIN 16

void cardManagerSetup();
String readCard();

#endif //EMBEDDED_CARDMANAGER_H
