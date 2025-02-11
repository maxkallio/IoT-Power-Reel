# API documentation
Details of the endpoints, their purpose, parameters, and responses.

---

#### Base URL
```
http://<server>/api/get.php
```

---

### Endpoints

#### **Get available locker**
- **URL**: `/getAvailableLocker`
- **Method**: `GET`
- **Description**: Retrieves a locker number for an available locker.
- **Parameters**: None
- **Response**:
  - **Success**:
    ```json
    {
        "success": true,
        "locker_number": <locker_number>
    }
    ```
  - **Failure**:
    ```json
    {
        "success": false,
        "locker_number": "No locker found."
    }
    ```

---

#### **Get available cable**
- **URL**: `/getAvailableCable`
- **Method**: `GET`
- **Description**: Retrieves a cable ID for an available cable.
- **Parameters**: None
- **Response**:
  - **Success**:
    ```json
    {
        "cable_id": <cable_id>
    }
    ```
  - **Failure**:
    ```json
    {
        "cable_id": "No cable found."
    }
    ```

---

#### **Get all cables**
- **URL**: `/getCables`
- **Method**: `GET`
- **Description**: Fetches all cables from the database.
- **Parameters**: None
- **Response**:
  - **Success**:
    ```json
    {
        "success": true,
        "data": [
            {
                "cable_id": <cable_id>,
                "cable_status": <status>,
                "user_id": <user_id>,
                "check_in": <check_in_date>,
                "check_out": <check_out_date>
            },
            ...
        ]
    }
    ```
  - **Failure**:
    ```json
    {
        "success": false,
        "data": "No results"
    }
    ```

---

#### **Get user details**
- **URL**: `/getUser?parameters:<user_id>`
- **Method**: `GET`
- **Description**: Fetches user details based on the given `user_id`.
- **Parameters**:
  - **`parameters`**: The user ID to fetch details for.
- **Response**:
  - **Success**:
    ```json
    {
        "success": true,
        "data": [
            {
                "user_id": <user_id>,
                "name": <user_name>,
                ...
            }
        ]
    }
    ```
  - **Failure**:
    ```json
    {
        "success": false,
        "data": "No results"
    }
    ```

---

#### **Scanned card**
- **URL**: `/scannedCard`
- **Method**: `POST`
- **Description**: Handles user actions when scanning their card. If the user has a cable, it will return it. Otherwise, it assigns a free cable to the user.
- **Parameters**:
  - **`user_id`**: The ID of the user scanning their card.
- **Response**:
  - **If the user returns a cable**:
    ```json
    {
        "success": true,
        "message": "Cable returned successfully."
    }
    ```
  - **If the user is assigned a cable**:
    ```json
    {
        "success": true,
        "message": "Cable assigned successfully."
    }
    ```
  - **If no free cables are available**:
    ```json
    {
        "success": false,
        "message": "No cables available."
    }
    ```
  - **If the `user_id` parameter is missing**:
    ```json
    {
        "success": false,
        "message": "Missing user_id parameter."
    }
    ```
  - **If there is an error returning a cable**:
    ```json
    {
        "success": false,
        "message": "Failed to return cable."
    }
    ```
  - **If there is an error assigning a cable**:
    ```json
    {
        "success": false,
        "message": "Failed to assign cable."
    }
    ```

---

### **Setup and usage notes**
- **Database connection**: The API relies on a global `$dbConnection` object for database interactions.
- **Error handling**: Each function provides clear success or failure messages in JSON format.
- **URL parsing**: The `$_SERVER['REQUEST_URI']` is used to determine the function to call based on the endpoint name.

---

### **Example Usage**

#### Fetch an Available Locker
**Request**:
```
GET /getAvailableLocker
```
**Response**:
```json
{
    "success": true,
    "locker_number": 5
}
```

---

#### Assign or return a cable
**Request**:
```
POST /scannedCard
Content-Type: application/json

{
    "user_id": "12345"
}
```
**Response** (User assigned a cable):
```json
{
    "success": true,
    "message": "Cable assigned successfully."
}
```

