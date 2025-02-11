#include "api.h"
#include "connectivity.h"

// JsonBuffer used to deserialize the Json fetched from the back-end API.
DynamicJsonDocument jsonBuffer(1024);

String makeApiCall(String type, String functionName, String parameters) {

  WiFiClient client;
  HTTPClient httpClient;

  String url = String(BASE_URL) + type + ".php" + "?" + functionName + "?" + parameters;
  httpClient.begin(client, url);
  int httpCode = httpClient.GET();

  if(httpCode == HTTP_CODE_OK) {
    String payload = httpClient.getString();
    return payload;
  } else {
    httpClient.end();
    return "Error: HTTP request failed with code " + String(httpCode);
  }
}

// Function for making a transaction, returns the assigned locker_number
String getLockerNumberWithTransaction(String userId) {

  String parameters = "parameters:" + userId;
  String response = makeApiCall("update", "transactionBasedStatusUpdate", parameters);

  if (response != "") {
    deserializeJson(jsonBuffer, response);
    if (jsonBuffer.containsKey("locker_number")) {
      return jsonBuffer["locker_number"].as<String>();
    } else {
      return "Error: locker_number not found in response";
    }
  } else {
    return "Error: Empty response from API";
  }
}

// Function for evaluating transaction type, returns the transaction type
String getTransactionType(String userId) {

  String parameters = "parameters:" + userId;
  String response = makeApiCall("get", "getTransactionType", parameters);

  if (response != "") {
    deserializeJson(jsonBuffer, response);
    if (jsonBuffer.containsKey("transactionType")) {
      return jsonBuffer["transactionType"].as<String>();
    } else {
      return "Error: transactionType not found in response";
    }
  } else {
    return "Error: Empty response from API";
  }
}

// Function for reverting a transaction, returns success in the response
void revertTransaction(String revertType, String lockerId, String userId, String cableId) {

  String parameters = "parameters:" + revertType + "," + lockerId + "," + userId + "," + cableId;
  String response = makeApiCall("update", "revertTransaction", parameters);

  if (response != "") {
    Serial.println("Successfully reverted a transaction");
  } else {
    Serial.println("Error: Revert transaction failed");
  }
}

String checkForReservation(String userId) {

  String parameters = "parameters:" + userId;
  String response = makeApiCall("get", "checkForReservation", parameters);

  if (response != "") {
    deserializeJson(jsonBuffer, response);
    if (jsonBuffer.containsKey("reservedLockers")) {
      return jsonBuffer["reservedLockers"].as<String>();
    } else {
      return "Error: locker_number not found in response";
    }
  } else {
    return "Error: Empty response from API";
  }
}

String retrieveReservation(String reservationId) {

  String parameters = "parameters:" + reservationId;
  String response = makeApiCall("update", "retrieveReservation", parameters);

  if (response != "") {
    deserializeJson(jsonBuffer, response);
    if (jsonBuffer.containsKey("locker_number")) {
      return jsonBuffer["locker_number"].as<String>();
    } else {
      return "Error: locker_number not found in response";
    }
  } else {
    return "Error: Empty response from API";
  }
}

// Function for making a transaction, returns the assigned locker_number
String getUserIdWithUID(String uid) {

  String uidNoSapce = "";

  // Remove spaces
  for (int i = 0; i < uid.length(); i++) {
    if (uid[i] != ' ') {
      uidNoSapce += uid[i];
    }
  }

  String parameters = "parameters:" + uidNoSapce;
  String response = makeApiCall("get", "getUserIdWithUID", parameters);

  if (response != "") {
    deserializeJson(jsonBuffer, response);
    if (jsonBuffer.containsKey("user_id")) {
      return jsonBuffer["user_id"].as<String>();
    } else {
      return "Error: user_id not found in response";
    }
  } else {
    return "Error: Empty response from API";
  }
}
