<?php

require '../database/connect.php';

//spara i en conf fil senare
ini_set('upload_max_filesize', '20M');

ini_set('post_max_size', '200M');

if ($_FILES["image"]["error"] == UPLOAD_ERR_OK) {
    $tmp_name = $_FILES["image"]["tmp_name"];
    $upload_dir = "../images/";
    $upload_file = $upload_dir . uniqid() . '_' . basename($_FILES["image"]["name"]);

    if (move_uploaded_file($tmp_name, $upload_file)) {
        $albumId = $_POST['albumId'];
        $query = "INSERT INTO Images (AlbumID, ImageName, FilePath, UploadDate) VALUES (:albumId, :ImageName, :imagePath, :UploadDate)";

        try {
            $stmt = $db->prepare($query);
            $stmt->bindParam(':albumId', $albumId, PDO::PARAM_INT);
            $stmt->bindParam(':ImageName', basename($_FILES["image"]["name"]), PDO::PARAM_STR);
            $stmt->bindParam(':imagePath', $upload_file, PDO::PARAM_STR);
            $stmt->bindParam(':UploadDate', date("Y-m-d H:i:s"), PDO::PARAM_STR);
            $stmt->execute();
            $response = array("status" => "success", "message" => "File uploaded successfully");
            echo json_encode($response);
        } catch (PDOException $e) {
            $response = array("status" => "error", "message" => "Database error: " . $e->getMessage());
            echo json_encode($response);
        }
    } else {
        $response = array("status" => "error", "message" => "Error moving uploaded file");
        echo json_encode($response);
    }
} else {
    $response = array("status" => "error", "message" => "The file" . basename($_FILES["image"]["name"]) . "upload failed with error code: " . $_FILES["image"]["error"]);
    echo json_encode($response);
}
