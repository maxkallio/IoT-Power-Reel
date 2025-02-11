#include "locker_offline.h"
#include "buzzer.h"
#include "LCD.h"

Locker lockers[] = {
    {0, 3, "", true}, 
    {1, 4, "", true}, 
    {2, 5, "", true}, 
    {3, 6, "", true}  
};

const int numLockers = sizeof(lockers) / sizeof(lockers[0]);

bool lockerFound;

void determineTransaction(String uid) {
    bool isFound = false;

    for (int i = 0; i < numLockers; i++) {
        if (lockers[i].uid == uid) {
            isFound = true;
            Serial.println("Transaction: Return");
            returnTransaction(uid);
            break;
        }
    }

    if (!isFound) {
        Serial.println("Transaction: Lend");
        lendTransaction(uid);
    }
}

void returnTransaction(String uid) {
    for (int i = 0; i < numLockers; i++) {
        if (lockers[i].uid == uid) {
            lockers[i].isFree = true;
            lockers[i].uid = "";
            displayMessage("Please return the power reel", 10000);
            unlockLocker(lockers[i].id);
            Serial.println("Reel in locker " + String(lockers[i].id) + " returned.");
            break;
        }
    }

}

void lendTransaction(String uid) {
    for (int i = 0; i < numLockers; i++) {
        if (lockers[i].isFree) {
            lockers[i].isFree = false; 
            lockers[i].uid = uid;
            displayMessage("Please retrieve the power reel from the locker", 10000);
            unlockLocker(lockers[i].id);
            Serial.println("Reel in locker " + String(lockers[i].id) + " lent to user: " + uid);
            lockerFound = true;
            break;
        }
        else {
            lockerFound = false;
        }
    }
    if (lockerFound == false) {
        displayMessage("No Power Reel available, try again later", 10000);
    }
}

void unlockLocker(int lockerIndex) {
    for (int i = 0; i < numLockers; i++) {
        if (lockers[i].id == lockerIndex) {
            digitalWrite(lockers[i].pin, HIGH);
            delay(1000); // I think we have to use delay here
            Serial.println("Locker " + String(lockerIndex) + " unlocked.");
            digitalWrite(lockers[i].pin, LOW);
            activateBuzzer();
            break;
        }
    }
}