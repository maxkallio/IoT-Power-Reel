# API

To make API calls with our embedded device we created an api.cpp file that stores all fuctions that make API calls to our IoT Power back-end. The api calls work because of the wifi connection we esteblished in the connectivity.cpp file. The code explaination for this file can be found on the WiFi connection embedded documentation page.

The api.cpp file contains the following fucntions:

* getLockerNumber

## The getLockerNumber function

The getLockerNumber function gets an available locker from the back-end. This function on the back-end also changes the database to set the database fields for the changing locker and cable instances. The function on the API also creates or updates the transaction made. This means that by calling the getAvailableLocker function on the back-end all the mutations to the database are done. The locker that is returned is enough for the fucntionality of getting and setting a locker and cable. The only relevant variable that is retrieved from calling the url is the locker that is assigned to the user. The user can use the locker to store or retrieve a cable. The system knows the transaction type that is made because when a transaction has no delivery/check_in date the user has a cable and when there is no "pending" transaction for the user yet the user wants to get a new cable.

In the code snippet below it is visable that the function return the locker that is opened or the fact that no locker is found. When a API call is made the locker number is echod on the back-end in a Json object and can be retrieved by using httpClient.getString() and deserializeJson. Now the locker number stored in the Json object can be returned using jsonBuffer and the key that is set for the value which is locker_number.

```cpp
String getLockerNumber(){
  // Initialize a wi-fi client & http client.
  WiFiClient client;
  HTTPClient httpClient;

  // Do a GET request to the IoT Power api.
  String url = "http://145.92.189.162/api/get.php?getAvailableLocker";
  httpClient.begin(client, url);
  int httpCode = httpClient.GET();

  // Check if the response is fine.
  if(httpCode == HTTP_CODE_OK) { // HTTP_CODE_OK == 200
    // Print the body of the GET-request response.
    String payload = httpClient.getString();
    Serial.println(payload);
    deserializeJson(jsonBuffer, payload);
    return jsonBuffer["locker_number"];
  } else {
    Serial.println("Unable to connect :(");
    return "No locker found.";
  }
}
```