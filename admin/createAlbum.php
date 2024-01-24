<?php

require '../database/connect.php';

header('Content-Type: application/json');

$json = file_get_contents('php://input');
$data = json_decode($json, true);



if (isset($data["albumName"]) && isset($data["albumDesc"])) {

    $name = $data["albumName"];
    $desc = $data["albumDesc"];

    $dbResponse = writeAlbumsToDb($db, $name, $desc);

    echo $dbResponse;
} else {
    $response = array("status" => "error", "message" => "Fel Fel Fel");
    echo json_encode($response);
}



function writeAlbumsToDb($db, $name, $desc)
{

    $query = "INSERT INTO Albums (AlbumName, Description, CreationDate) VALUES (:albumName, :Description, :CreationDate)";

    try {
        $stmt = $db->prepare($query);
        $stmt->bindParam(':albumName', $name, PDO::PARAM_STR);
        $stmt->bindParam(':Description', $desc, PDO::PARAM_STR);
        $stmt->bindParam(':CreationDate', date("Y-m-d H:i:s"), PDO::PARAM_STR);
        $stmt->execute();
        $response = array("status" => "success", "message" => "File uploaded successfully");
        return json_encode($response);
    } catch (PDOException $e) {
        $response = array("status" => "error", "message" => "Database error: " . $e->getMessage());
        return json_encode($response);
    }
}
