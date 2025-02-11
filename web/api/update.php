<?php

    include 'db.php';
    include 'get.php';

    // Get the url and select the part after the question mark to know what function to call.
    $url = $_SERVER['REQUEST_URI'];
    $url = str_replace("/api/update.php?", "", $url);

    // Check if url contains parameters.
    if(str_contains($url, "?parameters:") == true) {
        $url = substr($url, 0, strpos($url, "?parameters:"));
    }

    // Call the correct function from the given url after the parameters are removed.
    if ($url == "setCableTable"){
        setCableTable();
    }
    if ($url == "removeCablesFromLocker"){
        removeCablesFromLocker();
    }
    if ($url == "setLockerTable"){
        setLockerTable();
    }
    if ($url == "setAdminTransaction"){
        setAdminTransaction();
    }
    if ($url == "setReservation"){
        setReservation();
    }
    if ($url == "retrieveReservation"){
        retrieveReservation();
    }

    if ($url == "revertTransaction"){
        global $dbConnection;
        // Use the parameters to get the correct variables.
        $parameters = getParameters();
        $revertType = $parameters[0];
        $lockerId = $parameters[1];
        $userId = $parameters[2];

        // Query for getting the cable id from searching the Transaction table and selecting the transaction that was last added for a user.
        $sql = "SELECT cable_id FROM Transaction t WHERE t.transaction_id = (SELECT MAX(transaction_id) FROM Transaction WHERE user_id = ?) ";
        $sql->bind_param("s", $userId);
        $sql->execute();
        $result = $sql->get_result();
        $row = $result->fetch_assoc();
        $cableId = $row['cable_id'];

        // Call the correct function based on the revertType.
        if (revertType == "Lending"){
            revertTransactionLending($lockerId, $cableId, $userId);
        }
        if (revertType == "Returning"){
            revertTransactionReturning($lockerId, $cableId, $userId);
        }
    }

    if ($url == "transactionBasedStatusUpdate"){
        global $dbConnection;
        $userId = getParameters()[0];

        // Query for getting a pending transaction for the given user
        $sql = $dbConnection->prepare("SELECT * FROM transaction t WHERE t.user_id = ? AND t.check_in IS NULL");
        $sql->bind_param("s", $userId);
        $sql->execute();
        $transaction = $sql->get_result();

        // Check if there is a transaction pending for the user the interaction is returning a reel.
        if ($transaction->num_rows > 0) {
            $lockerId = getLockerWithStatus('Free');
            // Check if there was an available locker.
            if ($lockerId == "No locker Found"){
                echo json_encode(array("success" => false, "locker_number" => "No locker found."));
                return;
            }
            statusUpdateReturning($lockerId, $userId);
        }
        // If there is no transaction pending for the user the interaction is lending a reel. 
        else {
            $lockerId = getLockerWithStatus('Taken');
            // Check if there was an available locker.
            if ($lockerId == "No locker Found"){
                echo json_encode(array("success" => false, "locker_number" => "No locker found."));
                return;
            }
            statusUpdateLending($lockerId, $userId);
        }
        echoAvailableLocker($lockerId);
    }

    function checkAndEchoUpdate($result){
        global $dbConnection;
        // Return if the insert was successful or not. Also return the data.
        if ($result === TRUE) {
            echo json_encode(array("success" => true));
        } else {
            echo json_encode(array("success" => false, "error" => $dbConnection->error));
        }
    }
    
    function setLockerStatus($status, $lockerId){
        global $dbConnection;
        // Query to set the status of the locker with the found ID.
        $sql = $dbConnection->prepare("UPDATE Locker SET locker_status = ? WHERE locker_id = ?");
        $sql->bind_param("ss", $status, $lockerId);
        $sql->execute();
    }

    function echoAvailableLocker($lockerId){
        global $dbConnection;
        $userId = getParameters()[0];

        // Query for getting a pending transaction for the given user
        $sql = $dbConnection->prepare("SELECT * FROM transaction t WHERE t.user_id = ? AND t.check_in IS NULL");
        $sql->bind_param("s", $userId);
        $sql->execute();
        $transaction = $sql->get_result();

        // Check if there is a transaction pending for the user the interaction is returning a reel.
        if ($transaction->num_rows > 0) {
            $lockerId = getLockerWithStatus('Free');
            // Check if there was an available locker.
            if ($lockerId == "No locker Found"){
                echo json_encode(array("success" => false, "locker_number" => "No locker found."));
                return;
            }
            statusUpdateReturning($lockerId, $userId);
        }
        // If there is no transaction pending for the user the interaction is lending a reel. 
        else {
            $lockerId = getLockerWithStatus('Taken');
            // Check if there was an available locker.
            if ($lockerId == "No locker Found"){
                echo json_encode(array("success" => false, "locker_number" => "No locker found."));
                return;
            }
            statusUpdateLending($lockerId, $userId);
        }
        echoAvailableLocker($lockerId);
    }

    function checkAndEchoUpdate($result){
        // Query for fetching an available locker.
        $sql = $dbConnection->prepare("SELECT locker_number FROM Locker l WHERE l.locker_id = ?");
        $sql->bind_param("s", $lockerId);
        $sql->execute();
        $result = $sql->get_result();
        $row = $result -> fetch_assoc();
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
            echo json_encode(array("success" => true, "locker_number" => $row["locker_number"]));
        } else {
            echo json_encode(array("success" => false, "locker_number" => "No locker found."));
        }
    }

    function statusUpdateReturning($lockerId, $userId){
        global $dbConnection;
        // Return if the insert was successful or not. Also return the data.
        if ($result === TRUE) {
            echo json_encode(array("success" => true));
        } else {
            echo json_encode(array("success" => false, "error" => $dbConnection->error));
        }

        setLockerStatus('Taken', $lockerId);

        // Query to set the locker ID, status and user in the cable table.
        $sql = $dbConnection->prepare("UPDATE Cable SET locker_id = ? AND cable_status = 'Free' AND user_id = NULL WHERE user_id = ?");
        $sql->bind_param("ss", $lockerId, $userId);
        $sql->execute();
        // Query to set the transaction in the transaction table. Important to notice is that I only want to update the latest transaction.
        $sql = $dbConnection->prepare("UPDATE Transaction SET check_in = NOW() WHERE transaction_id = (SELECT MAX(transaction_id) FROM Transaction WHERE user_id = ?)");
        $sql->bind_param("s", $userId);
        $sql->execute();
    }

    function statusUpdateLending($lockerId, $userId){
        global $dbConnection;

        $cableId = getCableWithLockerId($lockerId);
        setLockerStatus('Free', $lockerId);

        // Query to set the status, user and locker ID of the cable.
        $sql = $dbConnection->prepare("UPDATE Cable SET cable_status = 'Taken' AND user_id = ? AND locker_id = NULL WHERE locker_id = ?");
        $sql->bind_param("ss", $userId, $lockerId);
        $sql->execute();
        // Query to create a new transaction in the transaction table.
        $sql = $dbConnection->prepare("INSERT INTO Transaction (check_out, cable_id, user_id) VALUES (NOW(), ?, ?)");
        $sql->bind_param("ss", $cableId, $userId);
        $sql->execute();
    }

    function setLockerStatus($status, $lockerId){
        global $dbConnection;
        // Query to set the status of the locker with the found ID.
        $sql = $dbConnection->prepare("UPDATE Locker SET locker_status = ? WHERE locker_id = ?");
        $sql->bind_param("ss", $status, $lockerId);
        $sql->execute();
    }

    function echoAvailableLocker($lockerId){
        global $dbConnection;
        // Query for fetching an available locker.
        $sql = $dbConnection->prepare("SELECT locker_number FROM Locker l WHERE l.locker_id = ?");
        $sql->bind_param("s", $lockerId);
        $sql->execute();
        $result = $sql->get_result();
        $row = $result -> fetch_assoc();
        if ($result->num_rows > 0) {
            echo json_encode(array("success" => true, "locker_number" => $row["locker_number"]));
        } else {
            echo json_encode(array("success" => false, "locker_number" => "No locker found."));
        }
    }

    function statusUpdateReturning($lockerId, $userId){
        global $dbConnection;

        setLockerStatus('Taken', $lockerId);

        // Query to set the locker ID, status and user in the cable table.
        $sql = $dbConnection->prepare("UPDATE Cable SET locker_id = ? AND cable_status = 'Free' AND user_id = NULL WHERE user_id = ?");
        $sql->bind_param("ss", $lockerId, $userId);
        $sql->execute();
        // Query to set the transaction in the transaction table. Important to notice is that I only want to update the latest transaction.
        $sql = $dbConnection->prepare("UPDATE Transaction SET check_in = NOW() WHERE transaction_id = (SELECT MAX(transaction_id) FROM Transaction WHERE user_id = ?)");
        $sql->bind_param("s", $userId);
        $sql->execute();
    }

    function statusUpdateLending($lockerId, $userId){
        global $dbConnection;

        $cableId = getCableWithLockerId($lockerId);
        setLockerStatus('Free', $lockerId);

        // Query to set the status, user and locker ID of the cable.
        $sql = $dbConnection->prepare("UPDATE Cable SET cable_status = 'Taken' AND user_id = ? AND locker_id = NULL WHERE locker_id = ?");
        $sql->bind_param("ss", $userId, $lockerId);
        $sql->execute();
        // Query to create a new transaction in the transaction table.
        $sql = $dbConnection->prepare("INSERT INTO Transaction (check_out, cable_id, user_id) VALUES (NOW(), ?, ?)");
        $sql->bind_param("ss", $cableId, $userId);
        $sql->execute();
    }

    // Function to set the cable after manually setting lockers. This function is only used when a cable id is submitted.
    function setCableTable(){
        global $dbConnection;
        // Use the parameters to get the correct variables.
        $parameters = getParameters();
        $cableId = $parameters[0];
        $lockerId = $parameters[1];

        // Query for setting the cable table.
        $sql = $dbConnection->prepare("UPDATE Cable SET cable_status = 'Free' AND locker_id = ? AND user_id = NULL WHERE cable_id = ?");
        $sql->bind_param("ss", $lockerId, $cableId);
        $sql->execute();
        $result = $sql->get_result();
        checkAndEchoUpdate($result);
    }

    // Function to remove all cables from a locker when manually declared that no cables are present in a locker.
    function removeCablesFromLocker(){
        global $dbConnection;
        $lockerId = getParameters()[0];

        // Query for setting the cable table based on the locker id given.
        $sql = $dbConnection->prepare("UPDATE Cable SET cable_status = 'Taken' AND locker_id = NULL WHERE locker_id = ?");
        $sql->bind_param("s", $lockerId);
        $sql->execute();
        $result = $sql->get_result();
        checkAndEchoUpdate($result);
    }

    function setLockerTable(){
        global $dbConnection;
        // Use the parameters to get the correct variables.
        $parameters = getParameters();
        $lockerId = $parameters[0];
        $lockerStatus = $parameters[1];
        $lockerNumber = $parameters[2];

        // Query for setting the locker table.
        $sql = $dbConnection->prepare("UPDATE Locker SET locker_status = ? AND locker_number = ? WHERE locker_id = ?");
        $sql->bind_param("sss", $lockerStatus, $lockerNumber, $lockerId);
        $sql->execute();
        $result = $sql->get_result();
        checkAndEchoUpdate($result);
    }

    function setAdminTransaction(){
        global $dbConnection;
        // Use the parameters to get the correct variables.
        $parameters = getParameters();
        $changedFields = $parameters[0];
        $lockerId = $parameters[1];
        $adminId = $parameters[2];

        // Query for creating a new admin transaction.
        $sql = $dbConnection->prepare("INSERT INTO AdminTransaction (changed_fields, change_date, locker_id, admin_id) VALUES (?, NOW(), ?, ?)");
        $sql->bind_param("sss", $changedFields, $lockerId. $adminId);
        $sql->execute();
        $result = $sql->get_result();
        checkAndEchoUpdate($result);
    }

    function revertTransactionLending($lockerId, $cableId, $userId){
        global $dbConnection;
        // Revert the cable table.
        $sql = $dbConnection->prepare("UPDATE Cable SET cable_status = 'Free', locker_id = ?, user_id = NULL WHERE cable_id = ?");
        $sql->bind_param("ss", $lockerId, $cableId);
        $sql->execute();

        // Revert the locker table.
        $sql = $dbConnection->prepare("UPDATE Locker SET locker_status = 'Taken' WHERE locker_id = ?");
        $sql->bind_param("s", $lockerId);
        $sql->execute();

        // Close the transaction.
        $sql = $dbConnection->prepare("UPDATE Transaction SET check_in = NOW() WHERE transaction_id = (SELECT MAX(transaction_id) FROM Transaction WHERE user_id = ?)");
        $sql->bind_param("s", $userId);
        $sql->execute();
        $result = $sql->get_result();
        checkAndEchoUpdate($result);
    }

    function revertTransactionReturning($lockerId, $cableId, $userId){
        global $dbConnection;
        // Revert the cable table.
        $sql = $dbConnection->prepare("UPDATE Cable SET cable_status = 'Taken', locker_id = NULL, user_id = ? WHERE cable_id = ?");
        $sql->bind_param("ss", $userId, $cableId);
        $sql->execute();

        // Revert the locker table.
        $sql = $dbConnection->prepare("UPDATE Locker SET locker_status = 'Free' WHERE locker_id = ?");
        $sql->bind_param("s", $lockerId);
        $sql->execute();

        // Revert the transaction table.
        $sql = $dbConnection->prepare("UPDATE Transaction SET check_in = NULL WHERE transaction_id = (SELECT MAX(transaction_id) FROM Transaction WHERE user_id = ?)");
        $sql->bind_param("s", $userId);
        $sql->execute();
        $result = $sql->get_result();
        checkAndEchoUpdate($result);
    }


    function setReservation(){
        global $dbConnection;
        // Use the parameters to get the correct variables.
        $parameters = getParameters();
        $userId = $parameters[0];
        $cableId = $parameters[1];
        $lockerId = $parameters[2];

        // Query for setting the cable satus.
        $sql = $dbConnection->prepare("UPDATE Cable SET cable_status = 'Reserved' WHERE cable_id = ?");
        $sql->bind_param("s", $cableId);
        $sql->execute();

        // Query for setting the locker satus.
        $sql = $dbConnection->prepare("UPDATE Locker SET locker_status = 'Reserved' WHERE locker_id = ?");
        $sql->bind_param("s", $lockerId);
        $sql->execute();

        // Query for creating a new reservation.
        $sql = $dbConnection->prepare("INSERT INTO Reservation (reservation_user_id, reservation_cable_id, reservation_locker_id, reservation_status) VALUES (?, ?, ?, 'Pending')");
        $sql->bind_param("sss", $userId, $cableId, $lockerId);
        $sql->execute();
        $result = $sql->get_result();
        checkAndEchoUpdate($result);
    }

    function retrieveReservation(){
        global $dbConnection;
        // Use the parameters to get the correct variables.
        $reservationId = getParameters[0]();

        // Query for getting the reservation information using the given reservation ID.
        $sql = "SELECT * FROM Reservation r WHERE r.reservation_id = ?";
        $sql->bind_param("s", $reservationId);
        $sql->execute();
        $result = $sql->get_result();
        $row = $result->fetch_assoc();
        $userId = $row['reservation_user_id'];
        $cableId = $row['reservation_cable_id'];
        $lockerId = $row['reservation_locker_id'];

        statusUpdateLending($lockerId, $userId);

        // Query for creating a new reservation.
        $sql = $dbConnection->prepare("UPDATE Reservation SET reservation_status = 'Completed' WHERE reservation_user_id = ? AND AND reservation_status = 'Pending'");
        $sql->bind_param("s", $userId);
        $sql->execute();
        $result = $sql->get_result();

        echoAvailableLocker($lockerId);
    }

?>