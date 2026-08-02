<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$dataDir = __DIR__ . '/data';
$dataFile = $dataDir . '/presets.json';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($dataFile)) {
        readfile($dataFile);
    } else {
        echo json_encode(['items' => []]);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input', false, null, 0, 1048577);
    if (strlen($input) > 1048576) {
        http_response_code(413);
        echo json_encode(['error' => 'Payload too large']);
        exit;
    }
    $data = json_decode($input, true);
    if ($data === null) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON']);
        exit;
    }
    if (!is_array($data) || !isset($data['items']) || !is_array($data['items'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Expected an object with an items array']);
        exit;
    }
    if (!is_dir($dataDir)) {
        mkdir($dataDir, 0755, true);
    }
    $written = file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT), LOCK_EX);
    if ($written === false) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to write presets']);
        exit;
    }
    echo json_encode(['success' => true]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
