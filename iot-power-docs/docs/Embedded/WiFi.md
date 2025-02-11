
Our project requires the Wemos to fetch data from the back-end API. To do this a WiFi connection has to be made from the Wemos. After doing this the Wemos can use a web url to fetch Json data from the API. The WiFi connection is made in the wifi.cpp file of the project.

In the code snippet below it is shows that a WiFi connection can be made by using the WiFiClient.h and ArduinoJson.h libraries. The libraries make it possible to attempt a wifi connection using WiFi.begin with the given SSID and password. The while loop that checks WiFi.status() != WL_CONNECTED uses the WiFi status to determen wether a wifi connection is made 

The wifi setup fuction shown below tries to connect 4 times and then stops trying this is done so that the PlatformIO code does not stop working becuase of an infinite loop when the setup of the wifi is incorrect or the wifi is not available. For now the SSID and password are set to the Wemos that was used in Sam's personal project registered to the DLO because Sam made this code and used his own Wemos to test it.

```cpp
// Password and SSID for the Wifi.
#define WIFI_SSID "iotroam"
#define WIFI_PASSWORD "amqikyA95C"

// Set attempt variable to make sure the WiFi does not disrupt other functions when not able to connect.
int attemptCount = 0;

void WiFiSetup(){
    // Initialize the Serial-connection on a speed of 115200 b/s
    Serial.begin(115200);
    // Your WeMos tries to connect to your Wi-fi network  
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    // Keep the while-statement alive as long as we are NOT connected
    // to the Wi-fi network.
    while (WiFi.status() != WL_CONNECTED && attemptCount < 4) {
      delay(1000);
      Serial.println("Connecting to WiFi..");
      attemptCount ++;
    }
    Serial.println("Connected to the WiFi network");
}
```
