<?php

    include 'db.php';

    // Get the url and select the part after the question mark to know what function to call.
    $url = $_SERVER['REQUEST_URI'];
    $url = str_replace("/api/get.php?", "", $url);

    // Check if url contains parameters.
    if(str_contains($url, "?parameters:")) {
        $url = substr($url, 0, strpos($url, "?parameters:"));
    }

    // This function gets the parameters from the URL.
    function getParameters(){
        // Get the parameters from the URL.
        $parameters = $_SERVER['REQUEST_URI'];
        $parameters = substr($parameters, strpos($parameters, "?parameters:") + 1);
        $parameters = str_replace("parameters:", "", $parameters);

        // Separate the parameters to get an array with all parameters
        $parameters = explode(",", $parameters);
        return $parameters;
    }

    // Call the correct function from the given url when the parameters are removed.
    if ($url == "getCables"){
        getCables();
    }
    if ($url == "getUser"){
        getUser();
    }
    if ($url == "getTransactions"){
        getTransactions();
    }
    if ($url == "getOverdueTransactions"){
        getOverdueTransactions();
    }
    if ($url == "getLockers"){
        getLockers();
    }
    if ($url == "checkAdminPriviledges"){
        checkAdminPriviledges();
    }
    if ($url == "getFreeCables"){
        getFreeCables();
    }
    if ($url == "getLockerNumberFromId"){
        getLockerNumberFromId();
    }
    if ($url == "getCableFromLockerId"){
        getCableFromLockerId();
    }
    if ($url == "getTransactionType"){
        getTransactionType();
    }
    if ($url == "checkUserName"){
        checkUserName();
    }
    if ($url == "checkForReservation"){
        checkForReservation();
    }
    if ($url == "getUserIdWithUID"){
        getUserIdWithUID();
    }

    function checkAndEchoGet($result){
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
            echo json_encode(array("success" => true, "data" => $data));
        } else {
            echo json_encode(array("success" => false, "data" => "No results"));
        }
    }

    function getCables(){
        global $dbConnection;

        $sql = "SELECT * FROM Cable";
        $result = $dbConnection->query($sql);

        checkAndEchoGet($result);
    }

    function getUser(){
        global $dbConnection;
        $userId = getParameters()[0];

        $sql = $dbConnection->prepare("SELECT * FROM User u WHERE u.user_id = ?");
        $sql->bind_param("s", $userId);
        $sql->execute();
        $result = $sql->get_result();

        checkAndEchoGet($result);
    }

    function getTransactions(){
        global $dbConnection;

        $sql = "SELECT * FROM Transaction";
        $result = $dbConnection->query($sql);

        checkAndEchoGet($result);
    }

    function getOverdueTransactions(){
        global $dbConnection;

        $sql = "SELECT * FROM Transaction t WHERE t.check_out < (CURDATE() - INTERVAL 1 DAY) AND t.check_in IS NULL";
        $result = $dbConnection->query($sql);

        checkAndEchoGet($result);
    }

    function getLockers() {
        global $dbConnection;

        $sql = "SELECT * FROM Locker";
        $result = $dbConnection->query($sql);

        checkAndEchoGet($result);
    }

    function checkAdminPriviledges(){
        global $dbConnection;
        $parameters = getParameters();

        $adminId = $parameters[0];
        $password = $parameters[1];

        $sql = $dbConnection->prepare("SELECT * FROM Admin a WHERE a.admin_id = ? AND a.admin_password = ?");
        $sql->bind_param("ss", $adminId, $password);
        $sql->execute();
        $result = $sql->get_result();

        checkAndEchoGet($result);
    }

    function getCableFromLockerId(){
        global $dbConnection;
        $lockerId = getParameters()[0];

        $sql = $dbConnection->prepare("SELECT * FROM Cable c WHERE c.locker_id = ?");
        $sql->bind_param("s", $lockerId);
        $sql->execute();
        $result = $sql->get_result();

        checkAndEchoGet($result);
    }

    function getTransactionType(){
        global $dbConnection;
        $userId = getParameters()[0];
        
        // Query for getting a pending transaction for the given user
        $sql = $dbConnection->prepare("SELECT * FROM transaction t WHERE t.user_id = ? AND t.check_in IS NULL");
        $sql->bind_param("s", $userId);
        $sql->execute();
        $transaction = $sql->get_result();

        // If there is an open transaction for this user the user will be returning a power reel.
        if ($transaction->num_rows > 0) {
            echo json_encode(array("success" => true, "transactionType" => "Returning"));
        }
        // If there is no open transaction for this user the user will be lending a power reel.
        else {
            echo json_encode(array("success" => true, "transactionType" => "Lending"));
        }
    }

    // Function used for fetching a locker based on the status.
    function getLockerWithStatus($status){
        global $dbConnection;

        $sql = $dbConnection->prepare("SELECT locker_id FROM Locker l WHERE l.locker_status = ? LIMIT 1");
        $sql->bind_param("s", $status);
        $sql->execute();
        $result = $sql->get_result();

        if ($result->num_rows > 0) {
            $row = $result -> fetch_assoc();
            return $row["locker_id"];
        } else {
            return "No locker Found";
        }
    }

    // Function used for fetching a cable based on a lcoker ID.
    function getCableWithLockerId($lockerId){
        global $dbConnection;

        $sql = $dbConnection->prepare("SELECT cable_id FROM Cable c WHERE c.locker_id = ?");
        $sql->bind_param("s", $lockerId);
        $sql->execute();
        $result = $sql->get_result();

        if ($result->num_rows > 0) {
            $row = $result -> fetch_assoc();
            return $row["cable_id"];
        } else {
            return "No locker Found";
        }
    }

    function getFreeCables() {
        global $dbConnection;

        // Query for fetching a cable.
        $sql = $dbConnection->prepare("SELECT * FROM Cable c WHERE c.cable_status = 'Free'");
        $sql->execute();
        $result = $sql->get_result();

        checkAndEchoGet($result);
    }

    function getLockerNumberFromId() {
        global $dbConnection;
        $lockerId = getParameters()[0];

        // Query for fetching a locker number.
        $sql = $dbConnection->prepare("SELECT locker_number FROM Locker l WHERE l.locker_id = ?");
        $sql->bind_param("s", $lockerId);
        $sql->execute();
        $result = $sql->get_result();

        checkAndEchoGet($result);
    }

    function checkUserName() {
        global $dbConnection;
        $userName = getParameters()[0];

        // Query for fetching a locker number.
        $sql = $dbConnection->prepare("SELECT user_id FROM User u WHERE u.user_name = ?");
        $sql->bind_param("s", $userName);
        $sql->execute();
        $result = $sql->get_result();

        checkAndEchoGet($result);
    }

    function checkForReservation() {
        global $dbConnection;
        $userId = getParameters()[0];

        // Query for checking if the user with the given ID has reserved a cable.
        $sql = $dbConnection->prepare("SELECT reservation_id FROM Reservation r WHERE r.reservation_user_id = ? AND r.reservation_status = 'Pending'");
        $sql->bind_param("s", $userId);
        $sql->execute();
        $result = $sql->get_result();

        $data = [];
        $dataAsString = "";
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $data[] = implode(",", $row);
            }
            $dataAsString = implode(",", $data);
            echo json_encode(array("success" => true, "reservedLockers" => $dataAsString));
            $row = $result -> fetch_assoc();
            return $row["cable_id"];
        } else {
            return "No locker Found";
        }
    }

    function getUserIdWithUID(){
        global $dbConnection;
        $card_id = getParameters()[0];
        
        // Query for getting a pending transaction for the given user
        $sql = $dbConnection->prepare("SELECT user_id FROM User u WHERE u.card_id = ?");
        $sql->bind_param("s", $card_id);
        $sql->execute();
        $result = $sql->get_result();
        $row = $result -> fetch_assoc();
        if ($result->num_rows > 0) {
            echo json_encode(array("success" => true, "user_id" => $row["user_id"]));
        } else {
            echo json_encode(array("success" => false, "user_id" => "No user found."));
        }
    }

?>