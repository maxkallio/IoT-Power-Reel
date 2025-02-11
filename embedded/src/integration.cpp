#include "integration.h"
#include "hall-sensor.h"
#include "cardManager.h"
#include "connectivity.h"
#include "led.h"
#include "LCD.h"
#include "locker_offline.h"
#include "api.h"


void runIntegrationTests() {
    Serial.println("=== Starting Integration Tests ===");

    // Initialize all components
    Serial.println("Initializing components...");
    setupHallSensor();
    cardManagerSetup();
    WiFiSetup();
    LCDSetup();
    Serial.println("Components initialized.");

    while (true) {
        Serial.println("Waiting for RFID card scan...");

        // Step 1: Scan for RFID Card
        String cardId = readCard();
        if (cardId.isEmpty()) {
            Serial.println("No card detected. Please scan an RFID card.");
            delay(1000);
            continue;
        }

        Serial.println("Card detected: " + cardId);

        // Step 2: API Call to Authenticate User
        String userId = getUserIdWithUID(cardId);
        if (userId.startsWith("Error")) {
            Serial.println("Error authenticating user: " + userId);
            LCDScroll();
            continue;
        }
        Serial.println("User authenticated. User ID: " + userId);

        // Step 3: Check Locker Availability Using Hall Sensor
        Serial.println("Checking cable reel availability...");
        int sensorValue = analogRead(HALL_SENSOR_PIN);
        Serial.print("Hall Sensor Value: ");
        Serial.println(sensorValue);

        bool isCableReelAvailable = sensorValue >= MAGNET_DETECTED_THRESHOLD; // Magnet detected
        if (!isCableReelAvailable) {
            Serial.println("Cable reel is available.");
            displayMessage("Locker Available!", 2000);
        } else {
            Serial.println("Cable reel is not available.");
            displayMessage("No Power Reel.", 2000);
            continue;
        }

// Step 4: Assign and Unlock Locker
        String lockerNumber = getLockerNumberWithTransaction(userId);
        if (lockerNumber.startsWith("Error")) {
            Serial.println("Error assigning locker: " + lockerNumber);
            LCDScroll();
            continue;
        }

        Serial.println("Assigned Locker: " + lockerNumber);
        printLockerLCD(lockerNumber);

        // Step 5: Unlock the Locker
        rentLocker();
        Serial.println("Locker unlocked. Awaiting cable removal.");

        // Step 6: Wait for Cable Removal
        while (true) {
            sensorValue = analogRead(HALL_SENSOR_PIN);
            Serial.print("Sensor Value During Cable Removal: ");
            Serial.println(sensorValue);

            if (sensorValue < MAGNET_DETECTED_THRESHOLD) {
                Serial.println("Cable removed successfully.");
                displayMessage("Cable Removed. Thank You!", 3000);
                break;
            }

            delay(500);
        }

        // Final Confirmation
        Serial.println("Transaction complete. Locker is secured.");
        displayMessage("Transaction Complete.", 5000);

        // Pause before resetting for the next user
        delay(2000);
    }
}
