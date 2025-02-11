#include <unity.h>
#include "api.h"
#include "connectivity.h"

void setUp(void) {
    // Set up WiFi connection
    WiFiSetup();
}

void tearDown(void) {
    // Disconnect WiFi
    WiFi.disconnect();
}

void test_get_locker_number(void) {
    String lockerNumber = getLockerNumber();
    if (lockerNumber.length() == 0 || lockerNumber == "No locker found.") {
        Serial.println("FAIL: getLockerNumber() returned invalid result");
        Serial.print("Returned value: ");
        Serial.println(lockerNumber);
    }
    TEST_ASSERT_TRUE(lockerNumber.length() > 0);
    TEST_ASSERT_NOT_EQUAL_STRING("No locker found.", lockerNumber.c_str());
}

void RUN_UNITY_TESTS() {
    UNITY_BEGIN();
    RUN_TEST(test_get_locker_number);
    UNITY_END();
}

void setup() {
    // Wait for serial port to connect
    delay(2000);
    RUN_UNITY_TESTS();
}

void loop() {

}