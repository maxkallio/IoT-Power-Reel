#ifndef EMBEDDED_INTEGRATION_TEST_H
#define EMBEDDED_INTEGRATION_TEST_H

#include <Arduino.h>

// Function declarations for integration testing
void runIntegrationTests();

// Helper function to find the next available locker
String findNextAvailableLocker(const String& userId);

#endif // EMBEDDED_INTEGRATION_TEST_H
