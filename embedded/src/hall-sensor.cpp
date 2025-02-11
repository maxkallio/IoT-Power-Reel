#include "hall-sensor.h"

// Initialize the Hall Sensor
void setupHallSensor() {
    Serial.println("Initializing Hall Sensor...");
    pinMode(HALL_SENSOR_PIN, INPUT);
    Serial.println("Hall Sensor initialized.");
}

// Check locker availability based on Hall Sensor readings
void checkLockerAvailability() {
    Serial.println("Checking locker availability using Hall Sensor...");
    int sensorValue = analogRead(HALL_SENSOR_PIN);
    Serial.print("Sensor Value: ");
    Serial.println(sensorValue);

    if (sensorValue > MAGNET_DETECTED_THRESHOLD) {
        Serial.println("Magnetic field detected: Locker is occupied.");
    } else {
        Serial.println("No magnetic field detected: Locker is available.");
    }
}
