#include "locker.h"
#include "buzzer.h"

void unlockLocker(int lockerIndex) {
    for (int i = 0; i < numLockers; i++) {
        if (lockers[i].id == lockerIndex) {
            digitalWrite(lockers[i].pin, HIGH); // HIGH to unlock locker
            Serial.println("Locker " + String(lockerIndex) + " unlocked.");
            activateBuzzer();
            return;
        }
    }
}