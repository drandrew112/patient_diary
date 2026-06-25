<?php
require "helpers.php";
require "mysql.php";

$data = jsonInput();

$email = trim($data["email"] ?? "");
$password = $data["password"] ?? "";

if (!$email || !$password) {
    http_response_code(400);
    echo json_encode(["error" => "Email and password required"]);
    exit;
}

$stmt = $pdo->prepare("SELECT id FROM accounts WHERE email = ?");
$stmt->execute([$email]);

if ($stmt->fetch()) {
    http_response_code(409);
    echo json_encode(["error" => "Email already exists"]);
    exit;
}

$hashed = md5($password);

$stmt = $pdo->prepare("INSERT INTO accounts (email, password) VALUES (?, ?)");
$stmt->execute([$email, $hashed]);

echo json_encode(["success" => true]);