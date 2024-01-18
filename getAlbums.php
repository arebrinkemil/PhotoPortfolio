<?php

declare(strict_types=1);

require 'database/connect.php';

header('Content-Type: application/json');

try {
    $albums = getAlbums($db);

    echo json_encode([
        'status' => 'success',
        'albums' => $albums
    ]);
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}

function getAlbums(PDO $db): array
{
    $query = "select * from Albums";
    $stmt = $db->prepare($query);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
