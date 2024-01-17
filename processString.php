<?php
if (isset($_POST['inputText'])) {
    $inputText = $_POST['inputText'];
    $wordsArray = explode(' ', $inputText);
    echo json_encode($wordsArray);
} else {
    echo json_encode([]);
}
