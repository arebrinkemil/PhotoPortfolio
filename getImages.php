<?php


require 'database/connect.php';

header('Content-Type: application/json');

$json = file_get_contents('php://input');
$data = json_decode($json, true);


try {
    $images = getImages($db, $data['albumId']);

    echo json_encode([
        'status' => 'success',
        'images' => $images
    ]);
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}

function getImages(PDO $db, $albumId): array
{

    $stmt = $db->prepare("SELECT * FROM Images WHERE AlbumID = :albumId");
    $stmt->bindParam(':albumId', $albumId, PDO::PARAM_INT);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
