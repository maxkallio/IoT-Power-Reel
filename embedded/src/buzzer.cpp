#include "buzzer.h"
#include <Arduino.h>

// Define the buzzer pin
const int buzzerPin = 2;

void buzzerSetup() {
    // Set the buzzer pin as output
    pinMode(buzzerPin, OUTPUT);
}

void activateBuzzer() {
    // Activate the buzzer to indicate card read
    digitalWrite(buzzerPin, HIGH);
    delay(200); // Buzzer sound duration
    digitalWrite(buzzerPin, LOW);
}