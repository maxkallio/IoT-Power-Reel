#include "cardManager.h"
#include "LCD.h"
#include "hall-sensor.h"


#if ONLINE_MODE
#include "connectivity.h"
#include "api.h"
#include "buzzer.h"
#include "locker.h"
#else
#include "locker_offline.h"
#endif

// Variable hold the scanned card uid.
String uid = "";
// Define the amount of lcd characters.
int lcd_Chars_Amount = 20;

const int buzzerPin = 6;
unsigned long currentMillis = 0;

unsigned long cardScanInterval = 5000;
unsigned long lcdScrollInterval = 500;
unsigned long wifiHealthCheckInterval = 300000; // 5 minutes

unsigned long previousCardScanMillis = 0;
unsigned long previousLcdScrollMillis = 0;
unsigned long previousWifiCheckMillis = 0;

void setup() {
    Serial.begin(9600);   // Initiate a serial communication
    cardManagerSetup();
    LCDSetup();

    setupHallSensor();

    #if ONLINE_MODE
    WiFiSetup();
    buzzerSetup();
    #endif
    
    Serial.println("All lockers initialized and locked.");
}


void loop() {

    // Simulate locker operations
    #if LOCKER_MECHANISM_TEST
    for (int i = 0; i < numLockers; i++) {
        // Unlock a locker
        unlockLocker(i);
        delay(5000); // Keep it unlocked for 5 seconds
    }
    #endif

    currentMillis = millis(); // Overflows in 49.67 days, fix later

    if (currentMillis - previousLcdScrollMillis >= lcdScrollInterval) {
        previousLcdScrollMillis = currentMillis;  // Update the last LCD scroll time
        LCDScroll();
    }

    if (currentMillis - previousCardScanMillis >= cardScanInterval) {
        previousCardScanMillis = currentMillis;  // Update the last card scan time
        uid = readCard();
        #if ONLINE_MODE
            if (uid != "") {
                String userId = getUserIdWithUID(uid); // Get the user ID from the database based on the uid from the card reader.
                if (userId == "No user found."){
                    displayMessage("Please register your card.", 5000);
                } else {
                    String reservation = checkForReservation(userId);
                    if (reservation == "None"){
                        String availableLocker = getLockerNumberWithTransaction(userId); // Get the unlocked locker number using the user ID
                        String transactionType = getTransactionType(userId); // Get the transaction type from the user ID
                        printInteractionLCD(availableLocker, transactionType, userId); // Print all steps the user has to do to complete their transaction
                    } else {
                        String availableLocker = retrieveReservation(reservation); // Get the unlocked locker number using the reservation ID.
                        // Get all the lockerIds in case multiple lockers where reserved.
                        String availableLockerArray[25];
                        int index = 0;
                        int startIndex = 0;
                        int commaIndex = availableLocker.indexOf(',');
                        // Seperate the reservation string by comma.
                        while (commaIndex != -1) {
                            availableLockerArray[index] = availableLocker.substring(startIndex, commaIndex);
                            index++;
                            startIndex = commaIndex + 1;
                            commaIndex = availableLocker.indexOf(',', startIndex);
                        }
                        // Add the last substring after the last comma.
                        availableLockerArray[index] = availableLocker.substring(startIndex);
                        // Call printInteractionLCD function for every reservation made.
                        for (int i = 0; i <= index; i++) {
                            printInteractionLCD(availableLockerArray[i], "Lending", userId); // Print all steps the user has to do to complete their transaction.
                        }
                    }
                }
            }
        #else
            if (uid != "") {
                determineTransaction(uid);
            }
        #endif
    }

    #if ONLINE_MODE
        if (currentMillis - previousWifiCheckMillis >= wifiHealthCheckInterval) {
            previousWifiCheckMillis = currentMillis;  // Update the last Wi-Fi health check time
            if (WiFi.status() != WL_CONNECTED) {
                Serial.println("Wi-Fi connection lost. Reconnecting...");
                WiFiSetup();
            } else {
                Serial.println("Wi-Fi is connected.");
            }
        }
    #endif
}
