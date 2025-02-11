#include <Arduino.h>

constexpr int HALL_SENSOR_PIN = A0;  // Analog pin connected to KY-035
constexpr int MAGNET_DETECTED_THRESHOLD = 500; // Threshold for magnetic detection

// Initialize the Hall Sensor
void setupHallSensor();
// Check locker availability based on Hall Sensor readings
void checkLockerAvailability();