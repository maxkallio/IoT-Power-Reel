#include "cardManager.h"
MFRC522 mfrc522(SS_PIN, RST_PIN);   // Create MFRC522 instance.

void cardManagerSetup()
{
    SPI.begin();      // Initiate  SPI bus
    mfrc522.PCD_Init();   // Initiate MFRC522
}

String readCard() {
    // Look for new cards
    if ( ! mfrc522.PICC_IsNewCardPresent()) {
        return "";
    }

    // Select one of the cards
    if ( ! mfrc522.PICC_ReadCardSerial()) {
        return "";
    }

    //Show UID on serial monitor
    String uid = "";    
    for (byte i = 0; i < mfrc522.uid.size; i++) {
        uid.concat(String(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " "));
        uid.concat(String(mfrc522.uid.uidByte[i], HEX));
    }
    uid.toUpperCase();
    Serial.println(uid);
    return uid;
}