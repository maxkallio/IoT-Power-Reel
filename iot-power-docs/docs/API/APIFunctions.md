# Back-end API Functions

In this documentation page all the API code is explained. Our API consists of a CRUD operation that is made in the web folder of the project. By using Docker the api folder of the web part of the project is created as a back-end API of the IoT Power website. This page goes into all the functionalities that are created in the api folder. The API is used to make queries to the database of our project. Some queries are complex and do not fit into one of the CRUD operations. This resulted in some functions having different kind of CRUD operations in the CRUD named file they are in. This should not really matter because the main objective of the operation determence the placing in a file.

To understand our API it is important to first separate the files between different CRUD operations. The CRUD approach that we are using results in the following php files:

1. get.php
2. update.php

To connect to the database a db.php file is also created.

Every php file has the same top part that makes it possible to call funtions from a url in our project. For example typing http://localhost/api/get.php?getUser?parameters:1 in Chrome will restult in a Json object that contains the user with ID 1. The functionality that is added to every php file except for the db.php file is the following code.

```php
    // Get the url and select the part after the question mark to know what function to call.
    $url = $_SERVER['REQUEST_URI'];
    $url = str_replace("/api/get.php?", "", $url);

    // Check if url contains parameters.
    if(str_contains($url, "?parameters:") == true) {
        $url = substr($url, 0, strpos($url, "?parameters:"));
    }
```

The code snippet below results in an variable where the function name is separated from the url. The functionality also makes sure the api call includes the correct file name to look at the functions in this file. For this url the functionality looks for get.php being added to the url to make sure the code is trying to reach the get.php file.

After doing this the url variable can be used to call functions in the get.php file. This is done by having multiple if statements that check for function names. The code snippet below shows two of these if statements.

```php
    // Call the correct function from the given url when the parameters are removed.
    if ($url == "getAvailableLocker"){
        getAvailableLocker();
    }
    if ($url == "getAvailableCable"){
        getAvailableCable();
    }
```

## db.php
The db.php file is an simple file to crate a database connection. This is done using a msqli function that creates a new database connection. This database connection can be used in the entire project by including db.php in other php files.

```php
    // Main file for connecting to the database as instructed on the back end page of the knowledgebase.
    $dbConnection = new mysqli("mariadb", "root", "root123", "locker");

    if ($dbConnection->connect_error) {
        echo json_encode(array("success" => false, "error" => $dbConnection->connect_error));
        exit();
    }
```

## get.php
The get.php file is used to get data from the database. The file has the following functions:

* getAvailableLocker
* getAvailableCable
* getCables
* getUser
* getTransactions
* getOverdueTransactions

The getAvailableLocker function gets a locker from the database that has a status of Free. The function only wants one locker to be returned by the database and this is why the query shown below uses a LIMIT clause. The code below does a query request to the database and now gets a result from the query. To check if the query has succeded the number of rows that are returned should be bigger than 0.

```php
    // Get a locker number for an available locker.
    function getAvailableLocker() {
        global $dbConnection;
        // Query for fetching the rolls.
        $sql = "SELECT locker_number FROM Locker l WHERE l.locker_status = 'Free' LIMIT 1";
        $result = $dbConnection->query($sql);
        $row = $result -> fetch_assoc();

        if ($result->num_rows > 0) {
            echo json_encode(array("success" => true, "locker_number" => $row["locker_number"]));
        } else {
            echo json_encode(array("success" => false, "locker_number" => "No locker found."));
        }
    }
```

The getAvailableCable function gets a cable from the database that has a status of Free. The function only wants one cable to be returned by the database and this is why the query shown below uses a LIMIT clause. The code below does a query request to the database and now gets a result from the query. To check if the query has succeded the number of rows that are returned should be bigger than 0.

```php
    // Get a cable number for an available cable.
    function getAvailableCable() {
        global $dbConnection;
        // Query for fetching the rolls.
        $sql = "SELECT cable_id FROM Cable c WHERE c.cable_status = 'Free' LIMIT 1";
        $result = $dbConnection->query($sql);

        if ($result->num_rows > 0) {
            echo json_encode($result->fetch_assoc());
        } else {
            echo json_encode(array("cable_id" => "No cable found."));
        }
    }
```

The getCables function gets all cables from the database. This is easily done by selecting all columns from the cable table without setting a WHERE clause. The query succeeds when more than 0 rows are returned, because the database will always have cables. This means that when at least one cable is returned the query has succeeded. This database query is used in the cable dashboard of our IoT Power website. The dashboard needs all cables to make a HTML table that shows the cables.

```php
    function getCables() {
        global $dbConnection;
        // Query for fetching the cables.
        $sql = "SELECT * FROM Cable";
        $result = $dbConnection->query($sql);

        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
            echo json_encode(array("success" => true, "data" => $data));
        } else {
            echo json_encode(array("success" => false, "data" => "No results"));
        }
    }
```

The getUser function is used to get a specific user from the user table. This is needed because the cable and transaction tables only store a user id. To display a name in our dashboards the user name has to be retrieved by using the user id. This can by done with the parameters of the getUser request. The code will set parameters in the url API query made in the front-end.

First the getUser function has to separate the parameters from the url. This is done by using the standard way the url is made up. The part of the url after parameters: contains the parameters. Now that the parameters are known a simple database query can be made to get the correct user from the database.

```php
    function getUser() {
        global $dbConnection;
        // Get the parameters from the URL.
        $parameters = $_SERVER['REQUEST_URI'];
        $parameters = substr($parameters, strpos($parameters, "?parameters:") + 1);
        $parameters = str_replace("parameters:", "", $parameters);
        // Query for fetching a user.
        $sql = $dbConnection->prepare("SELECT * FROM User u WHERE u.user_id = ?");
        $sql->bind_param("s", $parameters);
        $sql->execute();
        $result = $sql->get_result();

        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
            echo json_encode(array("success" => true, "data" => $data));
        } else {
            echo json_encode(array("success" => false, "data" => "No results"));
        }
    }
```

The getTransactions function gets all transactions from the database. This is needed for the transactions dashboard in the front-end. The function looks like the get cabless function and acts in the same way. The only difference is the fact that the transactions are retrieved instead of the cables.

```php
    function getTransactions() {
        global $dbConnection;
        // Query for fetching the transactions.
        $sql = "SELECT * FROM Transaction";
        $result = $dbConnection->query($sql);

        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
            echo json_encode(array("success" => true, "data" => $data));
        } else {
            echo json_encode(array("success" => false, "data" => "No results"));
        }
    }
```

The getOverdueTransactions function gets all transactions that are overdue from the database. This can be done by setting the WHERE clause of the query. The clause should check the transactions table for transactions that have a check_out data that is more than one day ago. This makes a transaction overdue. This is because the transactions that are made more than one day ago and were not returned the same day include missing cables. The query should also include the fact that a transaction with a check_in value is a transaction that is completed. The WHERE clause should include two restrictions becuase of this. t.check_out < (CURDATE() - INTERVAL 1 DAY) to check that a transaction is later than a day and t.check_in IS NULL to check if a transaction was not completed.

```php
    function getOverdueTransactions(){
        global $dbConnection;
        // Query for fetching the transactions.
        $sql = "SELECT * FROM Transaction t WHERE t.check_out < (CURDATE() - INTERVAL 1 DAY) AND t.check_in IS NULL";
        $result = $dbConnection->query($sql);

        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
            echo json_encode(array("success" => true, "data" => $data));
        } else {
            echo json_encode(array("success" => false, "data" => "No results"));
        }
    }
```

## update.php
The update.php file is used to change data in the database. Some of the queries used in the file are different CRUD operations but the main goal of the functions are to achieve a change in the databse. The functions in the update.php file are.

* setStatusLocker
* setStatusCable
* setStatusForLending
* transactionBasedStatusUpdate

The setStatusLocker, setStatusCable, setStatusForLending functions where created before there was one function to execute all of these functionalities. Thes functions are not really used in our project any more. This is the reason that only the transactionBasedStatusUpdate will be explained on this page.

The transactionBasedStatusUpdate function can be separated into two parts. This is because the function starts by checking what kind of interaction the user is doing with the locker. This function is used when a user scans a card on the IoT Power station and tries to unlock a locker to either retrieve or return a cable. The function will know what kind of interaction the user is trying to do because of the transaction table in the database. When a user has a transaction in the transaction table that has no check_in the user is trying to check_in a cable. This means that all transaction without a check_in DATETIME are pending transactions or transactions that include cables that are lend out. By using this information in the query of the function a separation can be made between returning and lending cables.

```php
    // Function that updates the cable and locker status based on the transaction attatched to the user.
    global $dbConnection;
    // Get the parameters from the URL.
    $parameters = $_SERVER['REQUEST_URI'];
    $parameters = substr($parameters, strpos($parameters, "?parameters:") + 1);
    $parameters = str_replace("parameters:", "", $parameters);
    // Query for getting a pending transaction for the given user
    $sql = $dbConnection->prepare("SELECT * FROM transaction t WHERE t.user_id = ? AND t.check_in IS NULL");
    $sql->bind_param("s", $parameters);
    $sql->execute();
    $transaction = $sql->get_result();
```

A lot of the queries in the transactionBasedStatusUpdate function use the parameter send to the function in the url. The parameters send is the user id read from the RFID card that is scanned on the IoT Power station.

The part of the transactionBasedStatusUpdate function that handels a user returning a reel is desribed in the code snippet below. If the query above resulted in a transaction being found the user still has a cable and wants to return a power reel. Now that it is known that a user is returning a power cable the function will try to find an available locker for the user to put the cable in. This is done in the first query. When and if a locker is found a couple of mutation on the database can be done. The Locker that is assigned to the return of the cable should now have status taken because this locker will be used to store the cable. If the mutation works the cable that the user is retruning should be altered in the database. The locker_id, cable_status and user_id should be changed becuase all these values change after the return is completed. The cable now has a locker it is stored in, has status free and has no current user any more. Now the transaction that include a rented cable should be closed by setting the check_in date to the current time and date. This is done using the user id sent to the function in the parameters.

After all these values are updated the function should return the locker where the user can store their cable in. This is done because the embedded device should display the locker that is used for the retrun to the user using the LCD screen.

```php
    // Check if there is a transaction pending for the user the interaction is returning a reel.
    if ($transaction->num_rows > 0) {
        // Query for fetching an available locker.
        $sql = "SELECT locker_id FROM Locker l WHERE l.locker_status = 'Free' LIMIT 1";
        $result = $dbConnection->query($sql);
        $row1 = $result -> fetch_assoc();
        $lockerId = $row1["locker_id"];
        // If there is an available locker use the locker to alter values in the cable and locker tables.
        if ($result->num_rows > 0) {
            // Query to set the status of the locker with the found ID.
            $sql = $dbConnection->prepare("UPDATE Locker SET locker_status = 'Taken' WHERE locker_id = ?");
            $sql->bind_param("s", $lockerId);
            $sql->execute();
            // Return if the insert was successful or not.
            if ($sql->affected_rows > 0) {
                // The cable does now have a locker where it is stored in so the locker id should be set to the correct id.
                // Query to set the locker id in the cable table.
                $sql = $dbConnection->prepare("UPDATE Cable SET locker_id = ? WHERE user_id = ?");
                $sql->bind_param("ss", $lockerId, $parameters);
                $sql->execute();
                // Query to set the status in the cable table.
                $sql = $dbConnection->prepare("UPDATE Cable SET cable_status = 'Free' WHERE user_id = ?");
                $sql->bind_param("s", $parameters);
                $sql->execute();
                // Query to set the user in the cable table.
                $sql = $dbConnection->prepare("UPDATE Cable SET user_id = NULL WHERE user_id = ?");
                $sql->bind_param("s", $parameters);
                $sql->execute();
                // Query to set the transaction in the transaction table.
                $sql = $dbConnection->prepare("UPDATE Transaction SET check_in = NOW() WHERE user_id = ?");
                $sql->bind_param("s", $parameters);
                $sql->execute();
                // Return if the insert was successful or not.
                if ($sql->affected_rows > 0) {
                    // Last step is to echo the locker that is available for the user to return the power reel to.
                    // Query for fetching an available locker.
                    $sql = $dbConnection->prepare("SELECT locker_number FROM Locker l WHERE l.locker_id = ?");
                    $sql->bind_param("s", $lockerId);
                    $sql->execute();
                    $result = $sql->get_result();
                    $row2 = $result -> fetch_assoc();
                    echo json_encode(array("success" => true, "locker_number" => $row2["locker_number"]));
                } else {
                    echo json_encode(array("success" => false, "locker_number" => "No locker found.", "Else place" => "3th returning"));
                }            
            } else {
                echo json_encode(array("success" => false, "locker_number" => "No locker found.", "Else place" => "2nd returning"));
            }        
        } else {
            echo json_encode(array("success" => false, "locker_number" => "No locker found.", "Else place" => "1st returning"));
        }
    }

```

If the transactionBasedStatusUpdate function concludes that the user is renting a cable becuase the user has no open transactions the code snippet below is run. The function will first select a locker that is taken and therefor has a cable inside of it. After a locker is found that contains a cable a couple of mutations have to be made to the database. First the cable id has to be found that is attatched to the locker that is being opened. This is used because after this the locker will be empty and the correct cable can not be found any more using a locker id. Now that the cable id is safely stored the cable id can lose the stored locker id because the cable is not stored in a locker any more. The status of the locker and cable will also change. The user id of the user now renting the cable will be stored in the cable id because the cable is now attatched to a user instead of a locker.

After changing both the locker and cable tables in the database the function will create a new transaction. All values of the transaction will be set except of the check_in value. This is becasue this value can only be set when returning a cable to the locker station.

The last step of the function is again returning the locker that is being used to retrieve a cable. This is done because the embedded device should display the locker that is opened for the user to rend a cable using the LCD screen.

```php
    // If there is no transaction pending for the user the interaction is lending a reel. 
    else {
        // Query for fetching a taken locker.
        $sql = "SELECT locker_id FROM Locker l WHERE l.locker_status = 'Taken' LIMIT 1";
        $result = $dbConnection->query($sql);
        $row1 = $result -> fetch_assoc();
        $lockerId = $row1["locker_id"];
        if ($result->num_rows > 0) {
            // Query for fetching the cable id.
            $sql = $dbConnection->prepare("SELECT cable_id FROM Cable c WHERE c.locker_id = ?");
            $sql->bind_param("s", $lockerId);
            $sql->execute();
            $result = $sql->get_result();
            $row2 = $result -> fetch_assoc();
            $cableId = $row2["cable_id"];
            // Query to set the status of the locker with the found ID.
            $sql = $dbConnection->prepare("UPDATE Locker SET locker_status = 'Free' WHERE locker_id = ?");
            $sql->bind_param("s", $lockerId);
            $sql->execute();
            // Query to set the status of the cable.
            $sql = $dbConnection->prepare("UPDATE Cable SET cable_status = 'Taken' WHERE locker_id = ?");
            $sql->bind_param("s", $lockerId);
            $sql->execute();
            // Query to set the user of the cable.
            $sql = $dbConnection->prepare("UPDATE Cable SET user_id = ? WHERE locker_id = ?");
            $sql->bind_param("ss", $parameters, $lockerId);
            $sql->execute();
            // Query to set the locker id of the cable.
            $sql = $dbConnection->prepare("UPDATE Cable SET locker_id = NULL WHERE locker_id = ?");
            $sql->bind_param("s", $lockerId);
            $sql->execute();
            echo $sql->affected_rows;
            echo $sql->affected_rows > 0;
            // Return if the insert was successful or not.
            if ($sql->affected_rows > 0) {
                // Query to create a new transaction in the transaction table.
                // Set: check_out cable_id user_id
                $sql = $dbConnection->prepare("INSERT INTO transaction (check_out, cable_id, user_id) VALUES (NOW(), ?, ?)");
                $sql->bind_param("ss", $cableId, $parameters);
                $sql->execute();
                // Return if the insert was successful or not.
                if ($sql->affected_rows > 0) {
                    // Last step is to echo the locker that is available for the user to get a power reel from.
                    // Query for fetching an available locker.
                    $sql = $dbConnection->prepare("SELECT locker_number FROM Locker l WHERE l.locker_id = ?");
                    $sql->bind_param("s", $lockerId);
                    $sql->execute();
                    $result = $sql->get_result();
                    $row3 = $result -> fetch_assoc();
                    echo json_encode(array("success" => true, "locker_number" => $row3["locker_number"]));
                } else {
                    echo json_encode(array("success" => false, "locker_number" => "No locker found.", "Else place" => "3th lending"));
                }
            } else {
                echo json_encode(array("success" => false, "locker_number" => "No locker found.", "Else place" => "2nd lending"));
            }        
        } else {
            echo json_encode(array("success" => false, "locker_number" => "No locker found.", "Else place" => "1st lending"));
        }
    }
```
    