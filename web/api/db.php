<?php
    // Main file for connecting to the database as instructed on the back end page of the knowledgebase.
    $dbConnection = new mysqli("mariadb", "root", "root123", "locker");

    if ($dbConnection->connect_error) {
        echo json_encode(array("success" => false, "error" => $dbConnection->connect_error));
        exit();
    }
?>
