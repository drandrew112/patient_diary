<?php
require "helpers.php";
require "mysql.php";

$data = jsonInput();

$email = trim($data["email"] ?? "");
$password = $data["password"] ?? "";

$stmt = $pdo->prepare("SELECT id, email FROM accounts WHERE email = ? AND password = ?");
$stmt->execute([$email, md5($password)]);

$user = $stmt->fetch();

if (!$user) {
    http_response_code(401);
    echo json_encode(["error" => "Invalid login"]);
    exit;
}

$_SESSION["account_id"] = $user["id"];
$_SESSION["email"] = $user["email"];

echo json_encode([
    "success" => true,
    "account" => $user
]);