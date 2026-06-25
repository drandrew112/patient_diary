<?php
require "helpers.php";
require "mysql.php";

$accountId = requireLogin();
$method = $_SERVER["REQUEST_METHOD"];

if ($method === "GET") {
    $stmt = $pdo->prepare("SELECT * FROM patients WHERE account_id = ? ORDER BY id DESC");
    $stmt->execute([$accountId]);
    echo json_encode($stmt->fetchAll());
    exit;
}

$data = jsonInput();

if ($method === "POST") {
    $stmt = $pdo->prepare("
        INSERT INTO patients (account_id, first_name, last_name, birth_date)
        VALUES (?, ?, ?, ?)
    ");
    $stmt->execute([
        $accountId,
        $data["first_name"],
        $data["last_name"],
        $data["birth_date"]
    ]);

    echo json_encode(["success" => true, "id" => $pdo->lastInsertId()]);
    exit;
}

if ($method === "PUT") {
    $stmt = $pdo->prepare("
        UPDATE patients
        SET first_name = ?, last_name = ?, birth_date = ?
        WHERE id = ? AND account_id = ?
    ");
    $stmt->execute([
        $data["first_name"],
        $data["last_name"],
        $data["birth_date"],
        $data["id"],
        $accountId
    ]);

    echo json_encode(["success" => true]);
    exit;
}

if ($method === "DELETE") {
    $id = $_GET["id"] ?? 0;

    $stmt = $pdo->prepare("DELETE FROM patients WHERE id = ? AND account_id = ?");
    $stmt->execute([$id, $accountId]);

    echo json_encode(["success" => true]);
    exit;
}