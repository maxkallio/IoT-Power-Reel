#include "led.h"

const int ledPin = 1;  // Replace with the pin connected to your LED
const int blinkInterval = 500;  // Blink interval in milliseconds
const int blinkCount = 6;       // Number of times the LED will blink

void ledSetup() {
  pinMode(ledPin, OUTPUT); // Set the LED pin as output
}

void rentLocker() {
  // Blink the LED to indicate the locker to open
  for (int i = 0; i < blinkCount; i++) {
    digitalWrite(ledPin, HIGH); // Turn the LED on
    delay(blinkInterval);
    digitalWrite(ledPin, LOW);  // Turn the LED off
    delay(blinkInterval);
  }

  // Add other locker-related functionality if needed
  delay(5000); // Prevent repeated blinking for testing purposes
}
